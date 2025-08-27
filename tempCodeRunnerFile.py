from flask import Flask, render_template, request, jsonify
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
app.config['DATABASE'] = 'progress.db'


def init_db():
    with sqlite3.connect(app.config['DATABASE']) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                     
                task_id TEXT NOT NULL UNIQUE,
                completed BOOLEAN NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()


def get_db():
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/progress', methods=['POST'])
def update_progress():
    data = request.get_json()
    task_id = data.get('task_id')
    completed = data.get('completed')

    try:
        db = get_db()
        db.execute(
            'INSERT OR REPLACE INTO progress (task_id, completed) VALUES (?, ?)',
            (task_id, completed)
        )
        db.commit()
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})


@app.route('/api/progress')
def get_progress():
    try:
        db = get_db()
        progress = db.execute(
            'SELECT task_id, completed FROM progress').fetchall()
        return jsonify({p['task_id']: p['completed'] for p in progress})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
