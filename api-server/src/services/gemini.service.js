// This is a placeholder for the Gemini API service.
// In a real application, you would use the Google Generative AI SDK.
// For this example, we'll simulate a response.

async function generate(prompt) {
    console.log("--- MASTER PROMPT SENT TO GEMINI ---");
    console.log(prompt);
    console.log("------------------------------------");

    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate a response based on the prompt's output mode
    if (prompt.includes("REACT_JSON")) {
        return JSON.stringify([
            {
                "question": "What is 2 + 2?",
                "options": ["3", "4", "5", "6"],
                "correctAnswer": "4"
            },
            {
                "question": "What is the capital of Japan?",
                "options": ["Seoul", "Beijing", "Tokyo", "Bangkok"],
                "correctAnswer": "Tokyo"
            }
        ], null, 2);
    }

    if (prompt.includes("HTML")) {
        // Return a full HTML structure based on the template
        const template = require('./rag.service').retrieve('quiz', 'HTML').template;
        const generatedData = `const quizData = [
            {
                question: "From Prompt: What is the capital of France?",
                options: ["Berlin", "Madrid", "Paris", "Rome"],
                correctAnswer: "Paris"
            },
            {
                question: "From Prompt: Which planet is known as the Red Planet?",
                options: ["Earth", "Mars", "Jupiter", "Venus"],
                correctAnswer: "Mars"
            }
        ];`;
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Game</title>
    <style>
        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f0f0f0; }
        #quiz-container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center; width: 90%; max-width: 500px; }
        #question { font-size: 1.5rem; margin-bottom: 1rem; }
        #options-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .option-btn { background-color: #007bff; color: white; border: none; padding: 1rem; border-radius: 4px; cursor: pointer; font-size: 1rem; }
        .option-btn:hover { background-color: #0056b3; }
        #feedback { margin-top: 1rem; font-weight: bold; }
        #next-btn { background-color: #28a745; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 4px; cursor: pointer; font-size: 1rem; margin-top: 1rem; display: none; }
    </style>
</head>
<body>
    <div id="quiz-container">
        <h2 id="question">Question text will go here</h2>
        <div id="options-container">
            <!-- Options will be dynamically inserted here -->
        </div>
        <div id="feedback"></div>
        <button id="next-btn">Next Question</button>
    </div>

    <script>
        // --- START OF AI GENERATED CODE ---
        ${generatedData}
        // --- END OF AI GENERATED CODE ---

        const questionEl = document.getElementById('question');
        const optionsContainerEl = document.getElementById('options-container');
        const feedbackEl = document.getElementById('feedback');
        const nextBtn = document.getElementById('next-btn');

        let currentQuestionIndex = 0;

        function loadQuestion() {
            if (currentQuestionIndex >= quizData.length) {
                questionEl.textContent = "Quiz Completed!";
                optionsContainerEl.innerHTML = '';
                feedbackEl.textContent = '';
                nextBtn.style.display = 'none';
                return;
            }

            const currentQuestion = quizData[currentQuestionIndex];
            questionEl.textContent = currentQuestion.question;
            optionsContainerEl.innerHTML = '';
            feedbackEl.textContent = '';
            nextBtn.style.display = 'none';

            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('option-btn');
                button.addEventListener('click', () => selectAnswer(option, currentQuestion.correctAnswer));
                optionsContainerEl.appendChild(button);
            });
        }

        function selectAnswer(selectedOption, correctAnswer) {
            if (selectedOption === correctAnswer) {
                feedbackEl.textContent = "Correct!";
                feedbackEl.style.color = 'green';
            } else {
                feedbackEl.textContent = \`Wrong! The correct answer is \${correctAnswer}.\`;
                feedbackEl.style.color = 'red';
            }
            document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
            nextBtn.style.display = 'block';
        }

        nextBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            loadQuestion();
        });

        loadQuestion();
    </script>
</body>
</html>`;
    }

    if (prompt.includes("VBA")) {
        return `' AI-Generated Code
Sub StartQuiz()
    Question1
End Sub

Sub Question1()
    Dim userAnswer As String
    userAnswer = InputBox("From Prompt: What is the capital of Vietnam?")
    If LCase(userAnswer) = "hanoi" Then
        ShowFeedback True, "Hanoi"
    Else
        ShowFeedback False, "Hanoi"
    End If
    Question2
End Sub

Sub Question2()
    Dim userAnswer As String
    userAnswer = InputBox("From Prompt: What is the largest city in Vietnam?")
    If LCase(userAnswer) = "ho chi minh city" Then
        ShowFeedback True, "Ho Chi Minh City"
    Else
        ShowFeedback False, "Ho Chi Minh City"
    End If
End Sub
`;
    }

    return "Could not determine output mode from prompt.";
}

module.exports = {
    generate,
};
