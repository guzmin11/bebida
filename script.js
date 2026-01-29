// --- Config ---
const quizData = [
    {
        question: "Qual sua faixa de idade?",
        options: ["18 a 30 anos", "31 a 42 anos", "43 a 55 anos", "Mais de 55 anos"]
    },
    {
        question: "Quanto peso você quer se livrar nas próximas semanas?",
        options: ["1 a 5 kg", "5 a 10 kg", "10 a 20 kg", "Mais de 20 kg"]
    },
    {
        question: "Em quanto tempo você quer começar a ver sua barriga desinflamar e seu peso baixar?",
        options: ["3 a 7 dias", "8 a 14 dias", "15 a 30 dias", "O mais rápido possível"]
    },
    {
        // Index 3
        question: "Qual sua maior dificuldade hoje?",
        options: ["Fome constante / Ansiedade", "Inchaço na barriga", "Metabolismo muito lento", "Efeito sanfona"]
    },
    {
        // Index 4 - Will show ONLY after intermediate page
        question: "Você já tentou emagrecer e acabou frustrada?",
        options: ["Sim, várias vezes", "Sim, usando remédios", "Sim, com dietas difíceis", "Não, estou começando agora"]
    },
    {
        // Index 5 - Emotional/Final Question
        question: "Se eu te mostrar um método <span class='highlight'>simples</span> e <span class='highlight'>natural</span>, capaz de acelerar seu metabolismo e reduzir <span class='highlight'>fome</span> e <span class='highlight'>inchaço</span> em <span class='highlight'>7 dias</span>… você estaria disposta a tentar?",
        options: ["Sim, com certeza!", "Sim, se for simples!", "Talvez, depende.", "Quero tentar!"]
    }
];

const motivationImages = [
    "./uploaded_image_0_1768598772098.jpg",
    "./uploaded_image_1_1768598772098.png"
];

let currentStep = 0;
// Flag to ensure we don't show inter-page twice if user refreshes or buggy state
let intermediateShown = false;

document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
    initFAQ();
});

function startQuiz() {
    const intro = document.getElementById('intro-page');
    intro.style.opacity = '0';
    setTimeout(() => {
        intro.classList.add('hidden');
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.classList.remove('hidden');
        quizContainer.classList.add('fade-in');
        window.scrollTo(0, 0);
    }, 400);
}

function initQuiz() {
    const quizContent = document.getElementById('quiz-content');

    quizData.forEach((data, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = `question-step ${index === 0 ? '' : 'hidden'}`;
        stepDiv.id = `step-${index}`;

        const h2 = document.createElement('h2');
        h2.className = 'text-center';
        h2.style.marginBottom = '30px';
        h2.innerHTML = data.question;
        stepDiv.appendChild(h2);

        data.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-option';
            btn.innerHTML = `<span>${option}</span>`;
            btn.onclick = (e) => handleOptionClick(e, index);
            stepDiv.appendChild(btn);
        });

        // Insert motivational image for steps 1 and 2 (not 0, not 3 because 3 leads to carousel, not 4 because it's last)
        if (index === 1 || index === 2) {
            const imgDiv = document.createElement('div');
            imgDiv.className = 'mini-proof fade-in';
            const imgUrl = motivationImages[(index - 1) % motivationImages.length];
            imgDiv.innerHTML = `<img src="${imgUrl}" alt="Motivação"><p class="text-center" style="font-size:0.8rem; margin-top:5px; color:#888;">Resultados reais</p>`;
            stepDiv.appendChild(imgDiv);
        }

        quizContent.appendChild(stepDiv);
    });

    updateProgress();
}

function handleOptionClick(e, index) {
    const btn = e.currentTarget;

    btn.style.backgroundColor = 'var(--primary-color)';
    btn.style.color = '#000';
    btn.style.borderColor = 'var(--primary-color)';
    btn.style.transform = 'scale(0.98)';

    setTimeout(() => {
        nextStep(index);
    }, 300);
}

function nextStep(completedIndex) {
    // If we just completed index 3 ("Maior dificuldade"), pause!
    if (completedIndex === 3 && !intermediateShown) {
        showIntermediatePage();
        return;
    }

    if (currentStep < quizData.length - 1) {
        // Hide current
        document.getElementById(`step-${currentStep}`).classList.add('hidden');

        // Advance
        currentStep++;

        // Show next
        const nextDiv = document.getElementById(`step-${currentStep}`);
        nextDiv.classList.remove('hidden');
        nextDiv.classList.add('fade-in');

        window.scrollTo({ top: 0, behavior: 'smooth' });

        updateProgress();
    } else {
        finishQuiz();
    }
}

function showIntermediatePage() {
    intermediateShown = true;

    const quizContainer = document.getElementById('quiz-container');
    quizContainer.classList.add('hidden');

    const interPage = document.getElementById('intermediate-page');
    interPage.classList.remove('hidden');
    interPage.classList.add('fade-in');

    window.scrollTo(0, 0);
}

function resumeQuiz() {
    const interPage = document.getElementById('intermediate-page');
    interPage.classList.add('hidden');

    const quizContainer = document.getElementById('quiz-container');
    quizContainer.classList.remove('hidden');

    // Manually advance from 3 to 4 now
    document.getElementById(`step-3`).classList.add('hidden');
    currentStep = 4;

    const nextDiv = document.getElementById(`step-4`);
    nextDiv.classList.remove('hidden');
    nextDiv.classList.add('fade-in');

    updateProgress();
    window.scrollTo(0, 0);
}

function updateProgress() {
    const progressBar = document.getElementById('progress-fill');
    const percentage = Math.round(((currentStep + 1) / quizData.length) * 100);
    progressBar.style.width = `${percentage}%`;
}

function finishQuiz() {
    document.getElementById('quiz-container').classList.add('hidden');
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.remove('hidden');
    loadingScreen.classList.add('fade-in');

    window.scrollTo(0, 0);

    const textEl = document.getElementById('loading-text');
    setTimeout(() => textEl.textContent = "Analisando seu metabolismo...", 1000);
    setTimeout(() => textEl.textContent = "Comparando com 12.000 perfis...", 2500);
    setTimeout(() => textEl.textContent = "Encontramos uma compatibilidade!", 4000);

    setTimeout(() => {
        showSalesPage();
    }, 5000);
}

function showSalesPage() {
    document.getElementById('loading-screen').classList.add('hidden');
    const salesPage = document.getElementById('sales-page');
    salesPage.classList.remove('hidden');
    salesPage.classList.add('fade-in');

    // Load VSL video only when arriving on the Sales Page
    const video = document.getElementById('vsl-video');
    const hint = document.getElementById('vsl-controls-hint');
    if (video) {
        video.src = "https://drive.google.com/file/d/1cvbNjoE4HGOJ8ZsPg-tI3zpkJJ7FrJyb/preview";

        // Final quality is controlled by Drive, but we ensure it's loaded with autoplay
        // Show hint briefly and then on hover
        setTimeout(() => { hint.style.opacity = "1"; }, 2000);
        setTimeout(() => { hint.style.opacity = "0"; }, 6000);

        video.parentElement.addEventListener('mouseenter', () => { hint.style.opacity = "1"; });
        video.parentElement.addEventListener('mouseleave', () => { hint.style.opacity = "0"; });
    }

    window.scrollTo(0, 0);
}

function initFAQ() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(q => {
        q.addEventListener('click', () => {
            const answer = q.nextElementSibling;
            const arrow = q.querySelector('.arrow');

            if (answer.classList.contains('open')) {
                answer.classList.remove('open');
                arrow.classList.remove('rotate');
            } else {
                document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
                document.querySelectorAll('.arrow').forEach(ar => ar.classList.remove('rotate'));

                answer.classList.add('open');
                arrow.classList.add('rotate');
            }
        });
    });
}

function scrollCarousel(direction) {
    const carousel = document.getElementById('results-carousel');
    const scrollAmount = carousel.clientWidth * 0.8; // Scroll 80% of width
    carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}


