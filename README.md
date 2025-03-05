# Alarm Sensor Service

## How to Run the Project

### Install Dependencies

1. Install dependencies for the client app:

   ```sh
   cd ./dashboard
   npm i
   ```

2. Install dependencies for the API:

   ```sh
   cd ../api
   npm i
   ```

3. Install Go libraries:
   ```sh
   cd ./go-server
   go mod tidy
   ```

### Run the Project

To run the project, use `start.sh` at the root of the project:

```sh
cd ../..
./start.sh
```

> **Note:** You might need to make `start.sh` executable before using it:
>
> ```sh
> chmod +x ./start.sh
> ```

### Access the Client App

The client app is accessible at `http://localhost:8080/`.

### API Endpoints

- **GET** `http://localhost:8080/alarms`: Get the list of alarms. You can filter by `alarmType` and `sensorId`. Supports pagination using `page={pageNumber}&pageSize={numberOfItems}`. The `pageSize` is hardcoded to return 10 results per request.
- **POST** `http://localhost:8080/alarms`: Save a new alarm.
- **GET** `http://localhost:8080/alarms/:alarmId`: Fetch details of a specific alarm using `alarmId`.

## Considerations

- The validation is mocked due to lack of time. It checks for the `Mocked-Auth` key in the header with the value `LetMeIn`.
- The database creation is hardcoded as a constant string in the `database.go` file.
