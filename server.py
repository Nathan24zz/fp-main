import base64
import cv2
import eventlet
import socketio

sio = socketio.Server(cors_allowed_origins="*")
# the index.html file hosted by eventlet is a dummy file
# it appears to be required to host some html file.. 
app = socketio.WSGIApp(sio, static_files={
    '/': {'content_type': 'text/html', 'filename': 'index.html'}
})

@sio.on('connect')
def connect(sid, environ):
    # sio.emit('image', 'abcdefg')
    print('connect ', sid)

@sio.on('disconnect')
def disconnect(sid):
    print('disconnect ', sid)

cam = cv2.VideoCapture(0)
cam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

def send_image():
    while True:
        sio.sleep(0.2)
        _, frame = cam.read()                     # get frame from webcam
        frame = cv2.resize(frame, (320, 240))
        _, frame = cv2.imencode('.jpg', frame)    # from image to binary buffer
        data = base64.b64encode(frame)            # convert to base64 format
        sio.emit('image', data)  

if __name__ == '__main__':
    thread = sio.start_background_task(send_image)
    eventlet.wsgi.server(eventlet.listen(('', 5000)), app)
    cam.release()