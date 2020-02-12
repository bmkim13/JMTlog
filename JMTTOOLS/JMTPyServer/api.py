from flask import Flask, render_template, session
from flask import request
from flask_restful import Resource, Api
from flask_restful import reqparse
from flask_socketio import SocketIO, emit

from requests import get # to make GET request
from pathlib import Path
from multiprocessing.connection import Listener
from multiprocessing import current_process
import socket
from multiprocessing import Process
import threading, sys, os

IP = '127.0.0.1'
PORT = 9999
SIZE = 1024
ADDR = (IP, PORT)
g_server = None

app = Flask(__name__)
api = Api(app)
app.secret_key = 'secret'
socketio = SocketIO(app)
# server = Process(target=socketio.run(app))
count = 1

def download(url, file_name = None):
    if not file_name:
        file_name = url.split('/')[-1]
    with open(file_name, "wb") as file:
        response = get(url, verify=False)
        file.write(response.content)

user_no = 1

@app.before_request
def before_request():
    global user_no
    if 'session' in session and 'user-id' in session:
        pass
    else:
        session['session'] = os.urandom(24)
        session['username'] = 'user' + str(user_no)
        user_no += 1
@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect', namespace='/mynamespace')
def connect():
    emit("response", {'data': 'Connected', 'username': session['username']})

@socketio.on('disconnect', namespace='/mynamespace')
def disconnect():
    session.clear()
    print("Disconnected")

@socketio.on("request", namespace='/mynamespace')
def request(message):
    emit("response", {'data': message['data'], 'username': session['username']}, broadcast=True)


class CreateData(Resource):
    def get_var(self):
        global count
        return count
    def increase_counter(self):
        global count
        count += 1

    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('category', type=str)
            parser.add_argument('text', type=str)
            parser.add_argument('url', type=str)
            args = parser.parse_args()

            _trainCategory = args['category']
            _trainText = args['text']
            _trainImgUrl = args['url']
            Path("./"+_trainCategory).mkdir(parents=True, exist_ok=True)
            download(_trainImgUrl, "./" + _trainCategory + "/img_" + str(self.get_var()) + ".png")
            #download(_trainImgUrl)


            self.increase_counter()
            return {'sucess' : "success!!"}
        except Exception as e:
            return {'error':str(e)}


theVal = 1
class ExitServerThread(threading.Thread):
    def run(selfs):
        global theVal
        theVal = theVal + 1
        for x in range(1000000): pass
        print("Exiting api server!!!!!!")
        os._exit(1)
class quit(Resource):
    def get(self):
        # current_process().terminate(self)
        # current_process().join()
        ExitServerThread().start()

        return {'sucess': "qutting!!"}




api.add_resource(CreateData, '/upload')
api.add_resource(quit, '/quit')

def run_server():
    global socketio
    global app
    print("Staring api server!!!!!!")
    socketio.run(app)

if __name__ == '__main__':
    print("Staring api server!!!!!!")
    socketio.run(app)
    # with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
    #     server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    #     server_socket.bind(ADDR)
    #     server_socket.listen()
    #
    #     while True:
    #         client_socket, client_addr = server_socket.accept()
    #         msg = client_socket.recv(SIZE)
    #         print("[{}] message : {}".format(client_addr, msg))
    #         client_socket.sendall("welcome!".encode())
            #
            # if msg == b'close':
            #     func = request.environ.get('werkzeug.server.shutdown')
            #     func()
            # elif msg == b'start':
            #     sys.exit()
            #     app.run(debug=True)
            #
            # client_socket.close()
    #
    # address = ('127.0.0.1', 0)
    # listener = Listener(address, authkey=b'secret password')
    # conn = listener.accept()
    # print("connection accepted from", listener.last_accepted)
    # while 1:
    #     msg = conn.recv()
    #     if msg == 'close':
    #         func = request.environ.get('werkzeug.server.shutdown')
    #         func()
    #         conn.close()
    #         break;
    #     elif msg == 'start':
    #         app.run(debug=True)
    #         conn.close()
    #         break;
    #
    # listener.close()




