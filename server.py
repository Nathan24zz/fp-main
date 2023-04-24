import base64
import cv2
import eventlet
import socketio
import mediapipe as mp

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_pose = mp.solutions.pose

sio = socketio.Server(cors_allowed_origins="*")
# the index.html file hosted by eventlet is a dummy file
# it appears to be required to host some html file.. 
app = socketio.WSGIApp(sio, static_files={
    '/': {'content_type': 'text/html', 'filename': 'index.html'}
})

pose = mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)
cam = cv2.VideoCapture(0)
cam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

@sio.on('connect')
def connect(sid, environ):
    print('connect ', sid)

@sio.on('disconnect')
def disconnect(sid):
    print('disconnect ', sid)

def send_image():
    while True:
        sio.sleep(0.1)
        success, frame = cam.read()                     # get frame from webcam
        if not success: continue

        frame = cv2.resize(frame, (320, 240))
        # To improve performance, optionally mark the image as not writeable to
        # pass by reference.
        frame.flags.writeable = False
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(frame)
        # Draw the pose annotation on the image
        mp_drawing.draw_landmarks(
            frame,
            results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS,
            landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style())
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

        # encode and send to client
        _, frame = cv2.imencode('.jpg', frame)    # from image to binary buffer
        data = base64.b64encode(frame)            # convert to base64 format
        sio.emit('image', data)  

if __name__ == '__main__':
    thread = sio.start_background_task(send_image)
    eventlet.wsgi.server(eventlet.listen(('', 5000)), app)
    cam.release()