package service

import (
	"context"
	"database/sql"
	"net/http"
	"strings"
	"time"

	"github.com/GIT_USER_ID/GIT_REPO_ID/db"
	openapi "github.com/GIT_USER_ID/GIT_REPO_ID/go"
)


type APIService struct {
}


func NewAPIService() *APIService {
	return &APIService{}
}

// AuthLoginPost - Perform login and obtain token.
func (s *APIService) AuthLoginPost(ctx context.Context, loginRequest openapi.LoginRequest) (openapi.ImplResponse, error) {
	return openapi.Response(http.StatusOK,"loginSuccessful"), nil
}

// AlarmsGet - List alarms.
func (s *APIService) AlarmsGet(ctx context.Context, page int32, pageSize int32, sensorId string, type_ string) (openapi.ImplResponse, error) {
    baseQuery := "SELECT id, sensorId, timestamp, type FROM alarms"
    var conditions []string
    var args []interface{}

    if sensorId != "" {
        conditions = append(conditions, "sensorId = ?")
        args = append(args, sensorId)
    }
    if type_ != "" {
        conditions = append(conditions, "type = ?")
        args = append(args, type_)
    }

    if len(conditions) > 0 {
        baseQuery += " WHERE " + strings.Join(conditions, " AND ")
    }

	baseQuery += " ORDER BY timestamp DESC"
	
    if pageSize > 0 {
        baseQuery += " LIMIT ? OFFSET ?"
        args = append(args, pageSize, (page-1)*pageSize)
    }

	

    rows, err := db.GetDB().QueryContext(ctx, baseQuery, args...)
    if err != nil {
        return openapi.Response(http.StatusInternalServerError, "serverError"), err
    }
    defer rows.Close()

    var alarms []openapi.Alarm
    for rows.Next() {
        var alarm openapi.Alarm
        var timestamp string
        if err := rows.Scan(&alarm.Id, &alarm.SensorId, &timestamp, &alarm.Type); err != nil {
            return openapi.Response(http.StatusInternalServerError, "serverError"), err
        }

        // Convert timestamp to time.Time
        alarm.Timestamp, err = time.Parse("2006-01-02 15:04:05-07:00", timestamp)
        if err != nil {
            return openapi.Response(http.StatusInternalServerError, "serverError"), err
        }

        // Fetch visualizations for the alarm
        visQuery := "SELECT imageBase64 FROM visualizations WHERE alarmId = ?"
        visRows, visErr := db.GetDB().QueryContext(ctx, visQuery, alarm.Id)
        if visErr != nil {
            return openapi.Response(http.StatusInternalServerError, "serverError"), visErr
        }
        defer visRows.Close()

        var visualizations []openapi.Visualization
        for visRows.Next() {
            var visualization openapi.Visualization
            if visErr := visRows.Scan(&visualization.ImageBase64); visErr != nil {
                return openapi.Response(http.StatusInternalServerError, "serverError"), visErr
            }
            visualizations = append(visualizations, visualization)
        }

        alarm.Visualizations = visualizations
        alarms = append(alarms, alarm)
    }

    if err := rows.Err(); err != nil {
        return openapi.Response(http.StatusInternalServerError, "serverError"), err
    }

    if len(alarms) == 0 {
        return openapi.Response(http.StatusNoContent, "noAlarmFound"), nil
    }

    return openapi.Response(http.StatusOK, alarms), nil
}
// AlarmsPost - Create alarm.
func (s *APIService) AlarmsPost(ctx context.Context, alarm openapi.Alarm) (openapi.ImplResponse, error) {
	query := "INSERT INTO alarms(sensorId, timestamp, type) VALUES(?, ?, ?)"

	tx, err := db.GetDB().BeginTx(ctx, &sql.TxOptions{
		Isolation: sql.LevelLinearizable,
	})
	if err != nil {
		tx.Rollback()
		return openapi.Response(http.StatusInternalServerError,"serverError"),err
	}

	res, execErr := tx.Exec(query, alarm.SensorId, alarm.Timestamp, alarm.Type)
	if execErr != nil {
		tx.Rollback()
		return openapi.Response(http.StatusInternalServerError,"serverError"),err
	}
	alarmId, err := res.LastInsertId()
	if err != nil {
		tx.Rollback()
		return openapi.Response(http.StatusInternalServerError,"serverError"),err
	}
	alarm.Id = alarmId
	// Prepare the statement outside the loop
	stm, stmErr := tx.Prepare("INSERT INTO visualizations(alarmId,imageBase64) VALUES(?,?)")
	if stmErr != nil {
		tx.Rollback()
		return openapi.Response(http.StatusInternalServerError,"serverError"),err
	}
	defer stm.Close()

	// Note: For better performance, consider using batch imports for visualizations.
	for _, visualization := range alarm.Visualizations {
	 	_, execErr := stm.Exec(alarmId, visualization.ImageBase64)
		if execErr != nil {
			tx.Rollback()
			return openapi.Response(http.StatusInternalServerError,"serverError"),err
		}
	}

	txErr := tx.Commit()
	if txErr != nil {
		return openapi.Response(http.StatusInternalServerError,"serverError"),err
	}
	return openapi.Response(http.StatusOK,alarm),nil
}

// AlarmsAlarmIdGet - get a single alarm.
func (s *APIService) AlarmsAlarmIdGet(ctx context.Context, alarmId string) (openapi.ImplResponse, error) {
    query := "SELECT id, sensorId, timestamp, type FROM alarms WHERE id = ?"
    row := db.GetDB().QueryRowContext(ctx, query, alarmId)

    var alarm openapi.Alarm
    var timestamp string
    if err := row.Scan(&alarm.Id, &alarm.SensorId, &timestamp, &alarm.Type); err != nil {
        if err == sql.ErrNoRows {
            return openapi.Response(http.StatusNotFound, "alarmNotFound"), nil
        }
        return openapi.Response(http.StatusInternalServerError, "serverError"), err
    }

    // Convert timestamp to time.Time
    var err error
    alarm.Timestamp, err = time.Parse("2006-01-02 15:04:05-07:00", timestamp)
    if err != nil {
        return openapi.Response(http.StatusInternalServerError, "serverError"), err
    }

    // Fetch visualizations for the alarm
    visQuery := "SELECT imageBase64 FROM visualizations WHERE alarmId = ?"
    visRows, visErr := db.GetDB().QueryContext(ctx, visQuery, alarm.Id)
    if visErr != nil {
        return openapi.Response(http.StatusInternalServerError, "serverError"), visErr
    }
    defer visRows.Close()

    var visualizations []openapi.Visualization
    for visRows.Next() {
        var visualization openapi.Visualization
        if visErr := visRows.Scan(&visualization.ImageBase64); visErr != nil {
            return openapi.Response(http.StatusInternalServerError, "serverError"), visErr
        }
        visualizations = append(visualizations, visualization)
    }

    alarm.Visualizations = visualizations

    return openapi.Response(http.StatusOK, alarm), nil
}
