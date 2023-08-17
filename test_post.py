from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        print('Post')
    elif request.method == 'GET':
        if 'ЛКМ' in str(request):  # чтобы запрос открытия страницы не попал сюда и не сломал программу
            result = [0, 0, 0, 0]  # дельта x, дельта y, состояние ЛКМ, состояние ПКМ
            req = str(request).split('&')
            for i in range(3):
                if i == 0:
                    delt = req[i].split('=')[1]
                    delt_x, delt_y = delt.split(':')
                    result[0], result[1] = delt_x, delt_y
                else:
                    if 'undefined' in req[i] or 'отпущена' in req[i]:
                        result[i + 1] = 0
                    else:
                        result[i + 1] = 1
            print(result)
    return render_template('main_for_pk.html')


if __name__ == '__main__':
    app.run(port=8080, host='127.0.0.1')
