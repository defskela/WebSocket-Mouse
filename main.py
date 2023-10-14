from microdot_asyncio import Microdot, Response, send_file
from microdot_utemplate import render_template
from microdot_asyncio_websocket import with_websocket
from machine import UART

uart2 = UART(1, baudrate=115200, tx=00, rx=01)
app = Microdot()
Response.default_content_type = 'text/html'


@app.route('/')
async def index(request):
    return render_template('index.html')


@app.route('/ws')
@with_websocket
async def read_sensor(request, ws):
    while True:
        data = await ws.receive()
        print(data)
        uart2.write(data + '\n')
# Static CSS/JSS
@app.route("/static/<path:path>")
def static(request, path):
    if ".." in path:
        return "Not found", 404
    return send_file("static/" + path)


if __name__ == "__main__":
    try:
        app.run()
    except KeyboardInterrupt:
        pass
