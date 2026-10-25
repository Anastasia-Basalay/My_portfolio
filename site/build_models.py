"""Собирает встроенные копии всех .glb из models/ в js/data/model-data.js.
Нужно, чтобы 3D-модели показывались, когда сайт открыт двойным щелчком по index.html.
Запускай после добавления или замены любой модели:   python build_models.py
"""
import base64, glob, json, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
data = {f.replace("\\", "/"): base64.b64encode(open(f, "rb").read()).decode() for f in sorted(glob.glob("models/*.glb"))}
with open("js/data/model-data.js", "w", encoding="utf-8") as out:
    out.write("// Создано build_models.py — не редактируй вручную.\nwindow.modelData = " + json.dumps(data) + ";\n")
print("Готово, моделей:", len(data), list(data))
