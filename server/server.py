from flask import Flask, request, g # type: ignore
from words import WordDB
from passlib.hash import bcrypt
from session_store import SessionStore

app = Flask(__name__)
session_store = SessionStore()

def load_session_data():
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        session_id = auth_header[7:]
    else:
        session_id = None

    if session_id:
        session_data = session_store.get_session_data(session_id)
        print("loaded session data: ", session_data)
    
    #If the session ID is either missing or session data is invalid
    if session_id == None or session_data == None:
        #create a new session
        session_id = session_store.creatre_session()
        #load the new session data
        session_data = session_store.get_session_data(session_id)
    g.session_id = session_id
    g.session_data = session_data

# @app.route("/words/<int:word_id>", methods=["OPTIONS"])
# def handle_cors_options(word_id):
#     return "", 204, {
#         "Access-Control-Allow-Origin": "*",
#         "Access-Control-Allow-Methods": "PUT, DELETE",
#         "Access-Control-Allow-Headers": "Content-Type"
#     }

@app.before_request
def before_request():
    if request.method == "OPTIONS":
        response = app.response_class("", status=204)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content, Authorization"
        return response
    load_session_data()

@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content, Authorization"
    return response

@app.route("/sessions", methods=["GET"])
def retrieve_session():
    return {
        'id': g.session_id,
        'data': g.session_data
    }
    
@app.route("/words", methods=["POST"])
def create_word():
    print("the request data is: ", request.form)
    db = WordDB("words_db.db")
    print("the request data is: ", request.form)
    word = request.form['word']
    origin = request.form['origin']
    definition = request.form['definition']
    db.postWord(word, origin, definition)
    return "Created", 201, {"Access-Control-Allow-Origin": "*"}

@app.route("/words/<int:word_id>", methods=["PUT"])
def update_word(word_id):
    print("the update request data is: ", request.form)
    db = WordDB("words_db.db")
    retrived_word = db.getWord(word_id)
    if retrived_word:
        word = request.form["word"]
        origin = request.form["origin"]
        definition = request.form["definition"]
        db.putWord(word_id, word, origin, definition)
        return "Updated", 200, {"Access-Control-Allow-Origin" : "*"}
    else:
        return f"word {word_id} Not found", 404, {"Access-Control-Allow-Origin" : "*"}

@app.route("/words", methods=["GET"])
def get_word():
    print("Getting session data", g.session_data)
    if "user_id" not in g.session_data:
        return "Unauthorized", 401 
    db = WordDB("words_db.db")
    words = db.getWords()
    return words, 200, {"Access-Control-Allow-Origin": "*"}

@app.route("/words/<int:word_id>", methods=["GET"])
def get_word_by_id(word_id):
    db = WordDB("words_db.db")
    if db.getWord(word_id) is None:
        return f"word {word_id} Not found", 404, {"Access-Control-Allow-Origin" : "*"}
    else:
        db.getWord(word_id)
        return "retrived", 200, {"Access-Control-Allow-Origin": "*"}

@app.route("/words/<int:word_id>", methods=["DELETE"])
def delete_word(word_id):
    db = WordDB("words_db.db")
    if db.getWord(word_id) is None:
        return f"word {word_id} Not found", 404, {"Access-Control-Allow-Origin" : "*"}
    else:
        db.deleteWord(word_id)
        return "Deleted", 200, {"Access-Control-Allow-Origin" : "*"}

@app.route("/users", methods=["POST"])
def create_in_users_collection():

    print("the request data is: ", request.form)

    first_name = request.form["first_name"]
    last_name = request.form["last_name"]
    email = request.form["email"]
    password = request.form["password"]

    db = WordDB("words_db.db")

    if db.getUserByEmail(email):
        return f"User with {email} already exists", 422, {"Access-Control-Allow-Origin": "*"}
    else:
        encrypted_password = bcrypt.hash(password)
        db.createUser(first_name, last_name, email, encrypted_password)
        return "Created", 201, {"Access-Control-Allow-Origin" : "*"}

@app.route("/sessions/auth", methods=["POST"])
def login():
    print("the request data is: ", request.form)
    db = WordDB("words_db.db")
    email = request.form["email"]
    password = request.form["password"]
    user = db.getUserByEmail(email)
    if user is None or not bcrypt.verify(password, user["password"]):
        return "Wrong email or password", 401, {"Access-Control-Allow-Origin" : "*"}
    elif bcrypt.verify(password, user["password"]):
        g.session_data["user_id"] = user["id"]
        return "Authenticated", 201, {"Access-Control-Allow-Origin" : "*"}
    else:
        return "Authentication Failed", 401, {"Access-Control-Allow-Origin" : "*"}

@app.errorhandler(404)
def page_not_found(e):
    return {"error": "Resource not found"}, 404, {"Access-Control-Allow-Origin": "*"}

@app.route("/session/settings" , methods=["PUT"])
def update_session_settings():
    print("the request color is : ", request.form)
    color = request.form["color"]
    g.session_data["fav_color"] = color
    return "Color saved", 200

@app.route("/sessions", methods=["DELETE"])
def sign_out():
    g.session_data.pop("user_id")
    return "Signed out", 200, {"Access-Control-Allow-Origin" : "*"}

def run():
    app.run(port=8080)

if __name__ == "__main__":
    run()