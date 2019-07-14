# Risk-data-dashboard-server

 ### Clone project: 
 ```bash
 git clone https://github.com/shmulikmak/Risk-meter-dashboard-server.git
 cd Risk-meter-dashboard-server
 ```
 ### Run project: 
 ```bash
 npm install
 npm run seed-db
 npm start
 ```

  ### Run project with docker: 
 ```bash
 docker-compose up --build -d
 docker exec node-app npm run seed-db
 ```

Opem browser: http://localhost:8080 <br>
The client source code in [Risk-meter-dashboard-client](https://github.com/shmulikmak/Risk-meter-dashboard-client.git)

