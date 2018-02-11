from apps.web import web

if __name__ == "__main__":
    # web.app.run(debug=True, host="0.0.0.0", ssl_context=('ssl_cert.pem', 'ssl_key.pem'))
    web.app.run(debug=True, host="0.0.0.0")