#it is yet not checked if its correct
from flask import Flask, request, jsonify
from docx import Document

app = Flask(__name__)

# Sample keywords for each field
keywords = {
    "Healthcare and Medical": ["medical", "healthcare", "nurse"],
    "Science and Research": ["research", "science", "scientist"],
    "Engineering and Technology": ["engineering", "technology", "engineer"],
    "Design and Creative Arts": ["design", "creative", "artist"],
    "Education": ["education", "teacher", "teaching"],
    "Business and Finance": ["business", "finance", "accounting"],
    "Law and Public Service": ["law", "public service", "legal"],
    "Media and Communication": ["media", "communication", "journalist"]
}

@app.route('/check_resume', methods=['POST'])
def check_resume():
    field = request.form['field']
    file = request.files['resume']
    
    # Read the uploaded resume file
    if file.filename.endswith('.docx'):
        doc = Document(file)
        text = '\n'.join([p.text for p in doc.paragraphs])
    else:
        return jsonify({"message": "Unsupported file format"}), 400
    
    # Perform ATS check
    field_keywords = keywords.get(field, [])
    matches = [kw for kw in field_keywords if kw.lower() in text.lower()]
    
    return jsonify({
        "field": field,
        "keywords_matched": matches,
        "result": "Passed" if len(matches) > 0 else "Failed"
    })

if __name__ == '__main__':
    app.run(debug=True)
