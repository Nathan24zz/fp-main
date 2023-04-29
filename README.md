# fp-main

Final Project Main Program.\
Python server communicate with Javascript client. The server using socketio, runs on a thread alongside with ROS2 node 

## Run Server

```
python3 server.py
```
or
```
colcon build --packages-select motion_matching
source install/setup.bash
ros2 run motion_matching main
```

## Run Client

```
cd fp-app
npm start
```
