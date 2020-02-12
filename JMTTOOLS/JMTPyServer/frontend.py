import sys
from PyQt5 import QtWidgets
import requests
# from requests.adapters import HTTPAdapter
# from requests.packages.urllib3.util.retry import Retry
import os
# import threading
# import grequests
import subprocess
# from urllib3.contrib.appengine import AppEngineManager
import multiprocessing
import time
from multiprocessing.connection import Client
import socket
from base64 import b64encode

SERVER_IP = ''
SERVER_PORT = 9999
SIZE = 1024
SERVER_ADDR = (SERVER_IP, SERVER_PORT)

def http_proxy_connect(address, proxy = None, auth = None, headers = {}):

    def valid_address(addr):
        return isinstance(addr, (list, tuple)) and len(addr) == 2 and isinstance(addr[0], str) and isinstance(addr[1], (int, int))

    if not valid_address(address):
        raise ValueError("Invalid target address")

    if proxy == None:
        s = socket.socket()
        s.connect(address)
        return s, 0, {}

    if not valid_address(proxy):
        raise ValueError("Invalid proxy address")

    headers = {
        'host': address[0]
    }

    if auth != None:
        if isinstance(auth, str):
            headers['proxy-authorization'] = auth
        elif auth and isinstance(auth, (tuple, list)) and len(auth) == 2:
            headers['proxy-authorization'] = 'Basic ' + b64encode('%s:%s' % auth)
        else:
            raise ValueError("Invalid authentication specification")

    s = socket.socket()
    # s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.connect(proxy)
    fp = s.makefile('rw')

    fp.write('CONNECT %s:%d HTTP/1.0\r\n' % address)
    fp.write('\r\n'.join('%s: %s' % (k,v) for (k,v) in headers.items()) + '\r\n\r\n')
    fp.flush()

    statusline = fp.readline().rstrip('\r\n')

    if statusline.count(' ') < 2:
        fp.close()
        s.close()
        raise IOError('Bad response')
    version, status, statusmsg = statusline.split(' ', 2)
    if not version in ('HTTP/1.0', 'HTTP/1.1'):
        fp.close()
        s.close()
        raise IOError('Unsupported HTTP version')
    try:
        status = int(status)
    except ValueError:
        fp.close()
        s.close()
        raise IOError('Bad response')

    response_header = {}

    while True:
        tl = ''
        l = fp.readline().rstrip('\r\n')
        if l == '':
            break;
        if not ':' in l:
            continue
        k, v = l.split(':', 1)
        response_header[k.strip().lower()] = v.strip()

    fp.close()
    return (s, status, response_header)

# class responseObj(object):
#     def __init__(self, name):
#         self.name = name
#     def do_something(self):
#         proc_name = multiprocessing.current_process().name
#         print(" in %s SENDING %S", proc_name, self.name)
#         sys.stdout.flush()
#         try:
#             response = requests.get("http://127.0.0.1:5000/quit", verify=False,
#                                     proxies={"http": "http://168.219.61.252:8080"})
#         except Exception as e:
#             print(e)

# class requestObj(object):
#     def __init__(self, name):
#         self.name = name
#     def do_something(self):
#         proc_name = multiprocessing.current_process().name
#         print(" in %s SENDING %S", proc_name, self.name)

# def flaks_server_func(q):
#     p = multiprocessing.current_process()
#     print("Startring: ", p.name, p.pid)
#     sys.stdout.flush()
#     os.system("python api.py")
#
#     while(1):
#         obj = q.get(block=True)
#         res = responseObj('RESPONSE')
#         q.put(res)
#         res.do_something()
#         time.sleep(3)
#     print("Exiting : ", p.name, p.pid)
#     sys.stdout.flush()

# def gui_main_func(q, app):
#     p = multiprocessing.current_process()
#     print("Startring: ", p.name, p.pid)
#     sys.stdout.flush()
#
#
#     ex = FlaskyFrontEnd()


class FlaskyFrontEnd(QtWidgets.QWidget):
    def __init__(self):
        super().__init__()
        self.title = 'JMTPyServer'
        self.left = 100
        self.top = 100
        self.width = 220
        self.height = 150
        self.initUI()
        # self.q = q

    def initUI(self):
        self.setWindowTitle(self.title)
        self.setGeometry(self.left, self.top, self.width, self.height)

        self.lbl_start = QtWidgets.QLabel(self)
        self.lbl_start.setText("Start Server")
        self.lbl_start.move(20, 20)

        self.button_start = QtWidgets.QPushButton('Start', self)
        self.button_start.move(120, 15)

        self.lbl_quit = QtWidgets.QLabel(self)
        self.lbl_quit.setText("Quit Server")
        self.lbl_quit.move(20, 60)

        self.lbl_status = QtWidgets.QLabel(self)
        self.lbl_status.setText("IDLE")
        self.lbl_status.move(20, 100)

        self.button_quit = QtWidgets.QPushButton('Quit', self)
        self.button_quit.move(120, 55)

        # connect button to function on_click
        self.button_start.clicked.connect(self.start_on_click)
        self.button_quit.clicked.connect(self.quit_on_click)
        self.show()

    def quit_on_click(self):
        # req = requestObj("REQUEST")
        # req.do_something()

        # QUIT_SERVER_URL = 'http://127.0.0.1:5000/quit'
        # grequests.request(method='GET', url=QUIT_SERVER_URL)
        # grequests.Get(QUIT_SERVER_URL)
        # proxies = {
        #     'http': 'http://168.219.61.252:8080',
        #     'https': '168.219.61.252:8080',
        # }
        # genheaders = { 'Content-Type': 'application/json',}
        # session  = requests.Session()
        # retry = Retry(connect=3, backoff_factor=0.5)
        # adapter = HTTPAdapter(max_retries=retry)
        # session.mount('http://', adapter)
        # session.mount('https://', adapter)
        # proxies = requests.utils.get_environ_proxies(QUIT_SERVER_URL)
        # print(proxies)
        # response = requests.get(QUIT_SERVER_URL, verify=False, proxies=proxies)
        # try:
        #     response = requests.get("http://127.0.0.1:5000/quit", verify=False,
        #                             proxies={"http": "http://168.219.61.252:8080"})
        # except Exception as e:
        #     print(e)

        # response = session.get(QUIT_SERVER_URL)
        # print(response.status_code)
        # print(response.text)

        # http = AppEngineManager()
        # http.request('GET', QUIT_SERVER_URL)
        # address = ('127.0.0.1', 0)
        # conn = Client(address, authkey=b'secret password')
        # conn.send('close')
        # conn.close()
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
            client_socket.connect(SERVER_ADDR)
            # client_socket.send('hi'.encode())
            client_socket.send('quit'.encode())
            # msg = client_socket.recv(SIZE)
            # print("resp from server : {}".format(msg))

    def start_on_click(self):
        # val_a, val_b = self.textbox_a.text(), self.textbox_b.text()
        # url = "http://localhost:5000/adder/{}/{}".format(val_a, val_b)
        # r = requests.get(url)
        # json = r.json()
        # answer = json['calc']
        # QtWidgets.QMessageBox.question(
        #     self,
        #     "Message",
        #     "Answer: {}".format(str(answer)),
        #     QtWidgets.QMessageBox.Ok,
        #     QtWidgets.QMessageBox.Ok
        # )
        # self.textbox_a.setText("")
        # self.textbox_b.setText("")

        # address = ('127.0.0.1', 5050)
        # conn = Client(address, authkey=b'secret password')
        # conn.send('start')
        # conn.close()

        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
            client_socket.connect(SERVER_ADDR)
            # client_socket.send('hi'.encode())
            client_socket.send('start'.encode())
            # msg = client_socket.recv(SIZE)
            # print("resp from server : {}".format(msg))
        # (s, status, response_headers) = http_proxy_connect(('127.0.0.1/quit', 5000), ('168.219.61.252', 8080))
        # print(status, response_headers)
        # s.send('start'.encode())


# def exception_handler(request, exception):
#     print(exception)
#     exception.lbl_status.setText("Request failed")


if __name__ == '__main__':
    app = QtWidgets.QApplication(sys.argv)
    ex = FlaskyFrontEnd()

    subprocess.Popen(["python", "./api.py"] + sys.argv[1:])

    sys.exit(app.exec_())

    # queue = multiprocessing.Queue()
    # fs = multiprocessing.Process(name='flask_server', target=flaks_server_func, args=(queue,))
    # fs.daemon = True
    # fs.start()
    #
    # queue.close()
    # queue.join_thread()
    # fs.join()



