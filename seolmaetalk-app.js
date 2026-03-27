<script>
// ============================================
// 설매톡 v2.6 (도넛→스택바, 대시보드 순서 변경)
// ============================================

const SUPABASE_URL = 'https://efnqwonydsnqsydaeawk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbnF3b255ZHNucXN5ZGFlYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNzcxMzQsImV4cCI6MjA3Njg1MzEzNH0.GjEAPJtpYj0cwY5aM803dK2jvTyDymvaqnPbctHIKBI';

const INSURERS = [
    'KB손해보험', '흥국화재', '삼성화재', '메리츠화재', 'DB손해보험', '현대해상',
    '롯데손해보험', '한화손해보험', 'MG손해보험', 'NH농협손해보험', 'AIG손해보험',
    '하나손해보험', '라이나손보', 'AXA손해보험'
];

const INSURER_LOGOS = {
    'KB손해보험': 'https://cdn.imweb.me/thumbnail/20250406/35b1a73f72aa2.png',
    '흥국화재': 'https://cdn.imweb.me/thumbnail/20250406/36efe9b5439ac.png',
    '삼성화재': 'https://cdn.imweb.me/thumbnail/20250406/51d6ab2e63cf9.jpg',
    '메리츠화재': 'https://cdn.imweb.me/thumbnail/20250406/5215bfefda8d1.png',
    'DB손해보험': 'https://cdn.imweb.me/thumbnail/20250406/ae592ed957eb3.png',
    '현대해상': 'https://cdn.imweb.me/thumbnail/20250406/8686a18dc6d55.png',
    '롯데손해보험': 'https://cdn.imweb.me/thumbnail/20250406/5410261c3a32c.jpg',
    '한화손해보험': 'https://cdn.imweb.me/thumbnail/20250406/dd3a588f03f4a.png',
    'MG손해보험': 'https://cdn.imweb.me/thumbnail/20250406/c351c4575f774.png',
    'NH농협손해보험': 'https://cdn.imweb.me/thumbnail/20250406/79591f0672108.png',
    'AIG손해보험': 'https://cdn.imweb.me/thumbnail/20250406/ed22adc06928f.png',
    '하나손해보험': 'https://cdn.imweb.me/thumbnail/20250406/5950194539602.png',
    '라이나손보': 'https://cdn.imweb.me/thumbnail/20250406/c6524d3906127.jpg',
    'AXA손해보험': 'https://cdn.imweb.me/thumbnail/20250406/0022a68d5c762.jpg'
};

const LIFE_INSURERS = [
    '삼성생명', '한화생명', '교보생명', '메트라이프', '미래에셋생명', 'DB생명',
    '흥국생명', 'NH농협생명', '하나생명', 'KB라이프', '신한라이프', 'iM라이프',
    'KDB생명', 'BNP파리바카디프생명', '라이나생명', '동양생명', 'ABL생명',
    '푸본현대생명', 'AIA생명', '처브라이프', 'IBK연금보험'
];

const LIFE_INSURER_LOGOS = {
    '삼성생명': 'https://cdn.imweb.me/thumbnail/20230526/d2d04019860eb.png',
    '한화생명': 'https://cdn.imweb.me/thumbnail/20230526/ef6b3e6312850.png',
    '교보생명': 'https://cdn.imweb.me/thumbnail/20230526/6cf4399a3de7f.png',
    '메트라이프': 'https://cdn.imweb.me/thumbnail/20230526/c884e2ca6f8f4.png',
    '미래에셋생명': 'https://cdn.imweb.me/thumbnail/20230526/bf7106aa51653.png',
    'DB생명': 'https://cdn.imweb.me/thumbnail/20230601/d90454c9cf883.jpg',
    '흥국생명': 'https://cdn.imweb.me/thumbnail/20230526/43efd1b7b8943.png',
    'NH농협생명': 'https://cdn.imweb.me/thumbnail/20230526/a74a5e41a70df.png',
    '하나생명': 'https://cdn.imweb.me/thumbnail/20230601/fb7b932cf89f3.jpg',
    'KB라이프': 'https://cdn.imweb.me/thumbnail/20230719/d1782d52e0a30.jpg',
    '신한라이프': 'https://cdn.imweb.me/thumbnail/20230526/8664352a9d3c8.png',
    'iM라이프': 'https://cdn.imweb.me/thumbnail/20240611/7fffa9ef9f92c.jpg',
    'KDB생명': 'https://cdn.imweb.me/thumbnail/20230526/5b85593a88fba.png',
    'BNP파리바카디프생명': 'https://cdn.imweb.me/thumbnail/20230526/2ede29f63668c.png',
    '라이나생명': 'https://cdn.imweb.me/thumbnail/20230526/9782ebc4bfb94.png',
    '동양생명': 'https://cdn.imweb.me/thumbnail/20230526/d54c4f9e68824.png',
    'ABL생명': 'https://cdn.imweb.me/thumbnail/20230526/d70977f5fdfbb.png',
    '푸본현대생명': 'https://cdn.imweb.me/thumbnail/20230526/681dd4a8edc12.jpg',
    'AIA생명': 'https://cdn.imweb.me/thumbnail/20230526/b308e6544a250.jpg',
    '처브라이프': 'https://cdn.imweb.me/thumbnail/20230526/72476f92ee4fc.jpg',
    'IBK연금보험': 'https://cdn.imweb.me/thumbnail/20230526/58c4e57f88ee0.jpg'
};

let sb = null;
let currentPlannerId = null;
let currentPlannerEmail = null;
let currentPlannerName = null;
let insurerCommissionCodes = {};
let birthInputMode = 'birth';
let currentCredentialMode = '손해보험';
let allRequests = [];
let previousTab = null;
let currentInsuranceType = 'nonlife';

const appState = {
    currentStep: 1,
    formData: {},
    selectedProducts: [],
    selectedNonlifeInsurers: [],
    selectedLifeInsurers: [],
    selectedInsurers: [],
    generatedTexts: { kakao: '', sms: '' },
    sharedInsurers: []
};

let currentDateRange = { preset: '7days', startDate: null, endDate: null };
let currentDetailId = null;
let currentDetailData = null;
let selectedOtherInsurers = [];
let currentOtherInsuranceType = 'nonlife';

document.addEventListener('DOMContentLoaded', async () => {
    initKakao();
    initSupabase();
    await initUser();
    initTabs();
    initChips();
    initFormInputs();
    setupBirthdayInput();
    setupMedicalHistoryRadio();
    initDraggable();
});

function initKakao() {
    if (typeof Kakao !== 'undefined') {
        if (!Kakao.isInitialized()) {
            Kakao.init('2a2e79669ea6bbbf07f5d68ffa1cc67b');
            
            Kakao.Link.createDefaultButton = function() {
                if (window.open) {
                    const originalOpen = window.open;
                    window.open = function(url, name, features) {
                        if (!features) {
                            features = 'width=500,height=600,scrollbars=yes,resizable=yes';
                        }
                        return originalOpen.call(window, url, name || '_blank', features);
                    };
                }
            };
        }
        console.log('✅ Kakao SDK 초기화 성공');
    } else {
        console.warn('⚠️ Kakao SDK 로딩 중...');
        setTimeout(initKakao, 500);
    }
}

function initSupabase() {
    try {
        if (typeof window.supabase !== 'undefined') {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase 연결 성공');
        }
    } catch (err) {
        console.error('❌ Supabase 연결 실패:', err);
    }
}

async function initUser() {
    const memberInfo = await getImwebMemberInfo();
    
    if (memberInfo && memberInfo.email) {
        currentPlannerEmail = memberInfo.email;
        currentPlannerName = memberInfo.name;
        updateMypageTitle(memberInfo.name);
        updateGreetingText(memberInfo.name);
        
        if (supabase) {
            try {
                let { data } = await supabase.from('planners').select('id').eq('email', memberInfo.email).maybeSingle();
                
                if (!data) {
                    const { data: newPlanner } = await supabase.from('planners').insert({ email: memberInfo.email, name: memberInfo.name || '설계사' }).select().single();
                    if (newPlanner) currentPlannerId = newPlanner.id;
                } else {
                    currentPlannerId = data.id;
                }
                
                await loadCommissionCodes();
            } catch (err) {
                console.error('❌ 사용자 정보 처리 실패:', err);
            }
        }
    }
}

async function loadCommissionCodes() {
    if (!supabase || !currentPlannerId) return;
    
    try {
        const { data } = await supabase.from('insurer_credentials').select('insurer_name, commission_code').eq('planner_id', currentPlannerId);
        if (data) {
            insurerCommissionCodes = {};
            data.forEach(item => {
                if (item.commission_code) insurerCommissionCodes[item.insurer_name] = item.commission_code;
            });
            console.log('✅ 위촉코드 로드 완료:', Object.keys(insurerCommissionCodes).length + '개');
        }
    } catch (err) {
        console.error('❌ 위촉코드 로드 실패:', err);
    }
}

async function getImwebMemberInfo() {
    try {
        const response = await fetch('/dialog/join.cm', { credentials: 'include' });
        if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const nameInput = doc.querySelector('input[name="name"]');
            const emailInput = doc.querySelector('input[name="email"]');
            const uidInput = doc.querySelector('input[name="uid"]');
            
            if (nameInput && nameInput.value.trim()) {
                const uid = uidInput?.value.trim() || null;
                const name = nameInput.value.trim();
                let email = emailInput?.value.trim() || (uid ? `${uid}@imweb.com` : null);
                
                if (email && email.endsWith('@imweb.com')) {
                    email = email.substring(0, email.lastIndexOf('@imweb.com'));
                }
                
                if (email) {
                    const memberInfo = { uid, name, email };
                    localStorage.setItem('IMWEB_MEMBER', JSON.stringify(memberInfo));
                    return memberInfo;
                }
            }
        }
    } catch (err) {}
    
    try {
        const cached = localStorage.getItem('IMWEB_MEMBER');
        if (cached) return JSON.parse(cached);
    } catch (err) {}
    
    return null;
}

function updateMypageTitle(name) {
    const titleElement = document.getElementById('mypage-title');
    if (titleElement && name) {
        titleElement.textContent = `${name}님의 설계의뢰 내역`;
    }
}

function updateGreetingText(name) {
    const greetingElement = document.getElementById('greeting-text');
    if (greetingElement && name) {
        greetingElement.innerHTML = `${name}님,<br>안녕하세요!<br>설계 요청을 시작해봐요.`;
    }
}

function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
}

function switchGreetingMode(mode) {
    if (mode === 'history') {
        previousTab = 'form';
        switchTab('mypage');
    } else if (mode === 'code') {
        previousTab = 'form';
        switchTab('credentials');
    } else if (mode === 'dashboard') {
        previousTab = 'form';
        switchTab('dashboard');
    }
}

function goToHome() {
    previousTab = null;
    switchTab('form');
}

function goBack() {
    const detailView = document.getElementById('mypage-detail-view');
    if (detailView && detailView.style.display !== 'none') {
        showRequestList();
        return;
    }
    
    if (previousTab) {
        switchTab(previousTab);
        previousTab = null;
    } else {
        switchTab('form');
    }
}

function updateBackButtonVisibility() {
    const backBtn = document.getElementById('header-back-btn');
    const currentTab = Array.from(document.querySelectorAll('.tab-content')).find(t => t.classList.contains('active'))?.id;
    
    if (currentTab === 'form-tab' || previousTab === null) {
        backBtn.classList.add('hidden-btn');
    } else {
        backBtn.classList.remove('hidden-btn');
    }
}

function switchTab(tabName) {
    const tabButtons = document.querySelectorAll('.tab');
    if (tabButtons.length > 0) {
        tabButtons.forEach(t => t.classList.remove('active'));
        const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTabBtn) activeTabBtn.classList.add('active');
    }
    
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    updateTopMenuBar(tabName);
    updateBackButtonVisibility();
    
    if (tabName === 'mypage') {
        document.getElementById('mypage-list-view').style.display = 'block';
        document.getElementById('mypage-detail-view').style.display = 'none';
        loadRequests();
    } else if (tabName === 'credentials') {
        loadCredentials();
    } else if (tabName === 'dashboard') {
        loadDashboardData();
    }
}

function initChips() {
    const container = document.getElementById('product-chips');
    if (!container) return;
    
    const newContainer = container.cloneNode(true);
    container.parentNode.replaceChild(newContainer, container);
    
    newContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        
        chip.classList.toggle('selected');
        const value = chip.dataset.value;
        
        if (chip.classList.contains('selected')) {
            if (!appState.selectedProducts.includes(value)) {
                appState.selectedProducts.push(value);
            }
        } else {
            appState.selectedProducts = appState.selectedProducts.filter(p => p !== value);
        }
    });
}

function initFormInputs() {
    document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
        input.addEventListener('change', collectFormData);
    });
}

function calculateInsuranceAgeValue(year, month, day) {
    if (!year || !month || !day) return null;
    
    const birthYear = parseInt(year);
    const birthMonth = parseInt(month);
    const birthDay = parseInt(day);
    const currentYear = new Date().getFullYear();
    
    if (birthYear > currentYear || birthYear < 1900 || 
        birthMonth < 1 || birthMonth > 12 || 
        birthDay < 1 || birthDay > 31) {
        return null;
    }
    
    const today = new Date();
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    let monthsSinceBirthday;
    const lastBirthday = new Date(today.getFullYear(), birthMonth - 1, birthDay);
    
    if (lastBirthday > today) {
        lastBirthday.setFullYear(today.getFullYear() - 1);
    }
    
    const timeDiff = today - lastBirthday;
    const daysSinceBirthday = timeDiff / (1000 * 60 * 60 * 24);
    monthsSinceBirthday = daysSinceBirthday / 30.44;
    
    let insuranceAge;
    if (monthsSinceBirthday >= 6) {
        insuranceAge = age + 1;
    } else {
        insuranceAge = age;
    }
    
    return insuranceAge;
}

function setupBirthdayInput() {
    const yearInput = document.getElementById('birth-year');
    const monthInput = document.getElementById('birth-month');
    const dayInput = document.getElementById('birth-day');
    const currentYear = new Date().getFullYear();
    
    function updateInsuranceAgeDisplay() {
        const year = yearInput.value.trim();
        const month = monthInput.value.trim();
        const day = dayInput.value.trim();
        
        const ageDisplay = document.getElementById('insurance-age-display');
        const ageValue = document.getElementById('insurance-age-value');
        
        const insuranceAge = calculateInsuranceAgeValue(year, month, day);
        
        if (insuranceAge !== null) {
            ageValue.textContent = insuranceAge + '세';
            ageDisplay.style.display = 'block';
        } else {
            ageDisplay.style.display = 'none';
        }
    }
    
    yearInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        updateInsuranceAgeDisplay();
        if (e.target.value.length === 4 && parseInt(e.target.value) <= currentYear) monthInput.focus();
    });
    
    monthInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        if (e.target.value.length >= 2) {
            const month = parseInt(e.target.value);
            if (month > 12) e.target.value = '12';
            if (e.target.value.length === 2) dayInput.focus();
        }
        updateInsuranceAgeDisplay();
    });
    
    dayInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        if (e.target.value.length >= 2 && parseInt(e.target.value) > 31) e.target.value = '31';
        updateInsuranceAgeDisplay();
    });
}

function setupMedicalHistoryRadio() {
    const medicalRadios = document.querySelectorAll('input[name="medical-history"]');
    const detailSection = document.getElementById('medical-detail-section');
    
    medicalRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const value = e.target.value;
            if (value === '있음') {
                detailSection.classList.remove('hidden');
            } else {
                detailSection.classList.add('hidden');
            }
        });
    });
}

function toggleBirthMode(mode) {
    birthInputMode = mode;
    const birthBtn = document.getElementById('birth-mode-btn');
    const ageBtn = document.getElementById('age-mode-btn');
    const birthContainer = document.getElementById('birth-input-container');
    const ageContainer = document.getElementById('age-input-container');
    const insuranceAgeDisplay = document.getElementById('insurance-age-display');
    
    if (mode === 'birth') {
        birthBtn.classList.add('active');
        ageBtn.classList.remove('active');
        birthContainer.style.display = 'block';
        ageContainer.style.display = 'none';
    } else {
        ageBtn.classList.add('active');
        birthBtn.classList.remove('active');
        ageContainer.style.display = 'block';
        birthContainer.style.display = 'none';
        if (insuranceAgeDisplay) insuranceAgeDisplay.style.display = 'none';
    }
}

function initDraggable() {
    const modal = document.getElementById('seolmaetalk-modal-container');
    const header = document.getElementById('draggable-header');
    
    if (!modal || !header) return;
    
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let modalX = 0;
    let modalY = 0;
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        if (e.target.tagName === 'IMG' || e.target.closest('img')) return;
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        const rect = modal.getBoundingClientRect();
        modalX = rect.left;
        modalY = rect.top;
        
        e.preventDefault();
        document.body.style.userSelect = 'none';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        let newX = modalX + deltaX;
        let newY = modalY + deltaY;
        
        const maxX = window.innerWidth - modal.offsetWidth;
        const maxY = window.innerHeight - modal.offsetHeight;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        modal.style.left = newX + 'px';
        modal.style.top = newY + 'px';
        modal.style.transform = 'none';
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = '';
        }
    });
    
    header.addEventListener('touchstart', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        if (e.target.tagName === 'IMG' || e.target.closest('img')) return;
        
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        
        const rect = modal.getBoundingClientRect();
        modalX = rect.left;
        modalY = rect.top;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        
        let newX = modalX + deltaX;
        let newY = modalY + deltaY;
        
        const maxX = window.innerWidth - modal.offsetWidth;
        const maxY = window.innerHeight - modal.offsetHeight;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        modal.style.left = newX + 'px';
        modal.style.top = newY + 'px';
        modal.style.transform = 'none';
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
        }
    });
}

function openSeolmaetalkModal() {
    const overlay = document.getElementById('seolmaetalk-modal-overlay');
    const modal = document.getElementById('seolmaetalk-modal-container');
    
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const modalWidth = modal.offsetWidth;
        const modalHeight = modal.offsetHeight;
        const centerX = (window.innerWidth - modalWidth) / 2;
        const centerY = Math.max(10, (window.innerHeight - modalHeight) / 2);
        
        modal.style.left = centerX + 'px';
        modal.style.top = centerY + 'px';
        modal.style.transform = 'none';
    }, 0);
}

function closeSeolmaetalkModal() {
    const overlay = document.getElementById('seolmaetalk-modal-overlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('seolmaetalk-modal-overlay')?.addEventListener('click', function(e) {
    if (e.target.id === 'seolmaetalk-modal-overlay') closeSeolmaetalkModal();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('seolmaetalk-modal-overlay');
        if (overlay?.classList.contains('active')) closeSeolmaetalkModal();
    }
});

function openSeolmaetalkCompletionModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeSeolmaetalkCompletionModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('seolmaetalk-completion-modal')) {
        if (e.target.id === 'other-insurers-modal') {
            closeOtherInsurersModal();
        } else {
            e.target.classList.remove('active');
        }
    }
});

function switchInsuranceType(type) {
    currentInsuranceType = type;
    
    document.querySelectorAll('#step-3 .mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    renderInsurerSelection();
    updateShareButtons();
}

function nextStep(stepNum) {
    if (!validateCurrentStep()) return;
    
    if (stepNum === 3) {
        collectFormData();
        generateTexts();
        renderPreview();
        currentInsuranceType = 'nonlife';
        renderInsurerSelection();
        appState.sharedInsurers = [];
    }
    
    goToStep(stepNum);
}

function prevStep(stepNum) {
    goToStep(stepNum);
}

function goToStep(stepNum) {
    appState.currentStep = stepNum;
    
    document.querySelectorAll('.step').forEach((step, idx) => {
        const num = idx + 1;
        step.classList.remove('active', 'completed');
        if (num < stepNum) step.classList.add('completed');
        else if (num === stepNum) step.classList.add('active');
    });
    
    document.querySelectorAll('.step-content').forEach(content => content.classList.add('hidden'));
    document.getElementById(`step-${stepNum}`).classList.remove('hidden');
    
    updateTopMenuBar('form');
    
    const container = document.querySelector('#seolmaetalk-modal-container .container');
    if (container) {
        container.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

function validateCurrentStep() {
    const step = appState.currentStep;
    
    if (step === 1) {
        const name = document.getElementById('client-name').value.trim();
        if (!name) {
            showToast('이름을 입력해주세요', 'error');
            return false;
        }
        
        const genderChecked = document.getElementById('gender-male').checked || document.getElementById('gender-female').checked;
        if (!genderChecked) {
            showToast('성별을 선택해주세요', 'error');
            return false;
        }
        
        if (birthInputMode === 'birth') {
            const year = document.getElementById('birth-year').value.trim();
            const month = document.getElementById('birth-month').value.trim();
            const day = document.getElementById('birth-day').value.trim();
            
            if (!year || !month || !day) {
                showToast('생년월일을 모두 입력해주세요', 'error');
                return false;
            }
        } else {
            if (!document.getElementById('age-range-select').value) {
                showToast('연령대를 선택해주세요', 'error');
                return false;
            }
        }
        
        if (!document.querySelector('input[name="medical-history"]:checked')) {
            showToast('병력 유무를 선택해주세요', 'error');
            return false;
        }
    }
    
    if (step === 2) {
        if (appState.selectedProducts.length === 0) {
            showToast('보험 종류를 선택해주세요', 'error');
            return false;
        }
        
        const premiumMin = document.getElementById('premium-min').value;
        const premiumMax = document.getElementById('premium-max').value;
        
        if (!premiumMin || !premiumMax) {
            showToast('월 납입료를 입력해주세요', 'error');
            return false;
        }
        if (parseInt(premiumMin) > parseInt(premiumMax)) {
            showToast('최소 금액이 최대 금액보다 클 수 없습니다', 'error');
            return false;
        }
    }
    
    return true;
}

function collectFormData() {
    const genderMale = document.getElementById('gender-male');
    let clientGender = genderMale?.checked ? '남성' : (document.getElementById('gender-female')?.checked ? '여성' : '');
    
    let clientBirth = '';
    let insuranceAge = null;
    
    if (birthInputMode === 'birth') {
        const year = document.getElementById('birth-year').value.trim();
        const month = document.getElementById('birth-month').value.trim();
        const day = document.getElementById('birth-day').value.trim();
        if (year && month && day) {
            clientBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            insuranceAge = calculateInsuranceAgeValue(year, month, day);
        }
    } else {
        const ageSelect = document.getElementById('age-range-select');
        if (ageSelect.value) clientBirth = ageSelect.value;
    }
    
    const medicalHistory = document.querySelector('input[name="medical-history"]:checked');
    let medicalInfo = '';
    
    if (medicalHistory?.value === '있음') {
        const diagnosis = document.getElementById('medical-diagnosis').value.trim();
        medicalInfo = `병력: 있음`;
        if (diagnosis) medicalInfo += ` / 진단: ${diagnosis}`;
    } else {
        medicalInfo = `병력: 없음`;
    }
    
    appState.formData = {
        clientName: document.getElementById('client-name').value.trim(),
        clientGender,
        clientBirth,
        insuranceAge,
        medicalInfo,
        clientAdditionalInfo: document.getElementById('client-additional-info').value.trim(),
        products: [...appState.selectedProducts],
        premiumMin: parseInt(document.getElementById('premium-min').value) || 0,
        premiumMax: parseInt(document.getElementById('premium-max').value) || 0,
        screeningType: document.getElementById('screening-type').value,
        paymentPeriod: document.getElementById('payment-period').value,
        coveragePeriod: document.getElementById('coverage-period').value,
        refundType: document.getElementById('refund-type').value
    };
}

function generateTexts() {
    const data = appState.formData;
    
    let productsText = data.products.length <= 3 ? data.products.join(', ') : data.products.slice(0, 3).join(', ') + ` (+외 ${data.products.length - 3})`;
    
    let kakaoText = `• 고객: ${data.clientName}\n• 담보: ${productsText}\n• 예산: ${data.premiumMin}~${data.premiumMax}만원\n`;
    
    if (data.insuranceAge !== null) {
        kakaoText += `• 보험상령나이: ${data.insuranceAge}세\n`;
    }
    
    if (data.medicalInfo) kakaoText += `• ${data.medicalInfo}\n`;
    if (data.screeningType) kakaoText += `• 심사: ${data.screeningType}\n`;
    if (data.paymentPeriod || data.coveragePeriod) kakaoText += `• 기간: ${data.paymentPeriod || '-'} / ${data.coveragePeriod || '-'}\n`;
    if (data.refundType) kakaoText += `• 환급: ${data.refundType}\n`;
    if (data.clientAdditionalInfo) kakaoText += `• 추가정보: ${data.clientAdditionalInfo}\n`;
    
    let smsText = `고객 ${data.clientName} / ${productsText.replace(/, /g, '·')} / ${data.premiumMin}~${data.premiumMax}만원`;
    if (data.insuranceAge !== null) smsText += ` / ${data.insuranceAge}세`;
    if (data.screeningType) smsText += ` / ${data.screeningType}`;
    if (data.paymentPeriod && data.coveragePeriod) smsText += ` / ${data.paymentPeriod}·${data.coveragePeriod}`;
    if (data.refundType) smsText += ` / ${data.refundType}`;
    smsText += '.';
    
    appState.generatedTexts = { kakao: kakaoText, sms: smsText };
}

function renderPreview() {
    const data = appState.formData;
    let html = `<div class="preview-row"><div class="preview-label">고객</div><div class="preview-value">${data.clientName}</div></div>`;
    
    if (data.insuranceAge !== null) {
        html += `<div class="preview-row"><div class="preview-label">보험상령나이</div><div class="preview-value">${data.insuranceAge}세</div></div>`;
    }
    
    html += `<div class="preview-row"><div class="preview-label">담보</div><div class="preview-value">${data.products.join(', ')}</div></div>`;
    html += `<div class="preview-row"><div class="preview-label">예산</div><div class="preview-value">${data.premiumMin}~${data.premiumMax}만원</div></div>`;
    if (data.medicalInfo) html += `<div class="preview-row"><div class="preview-label">병력</div><div class="preview-value">${data.medicalInfo}</div></div>`;
    if (data.screeningType) html += `<div class="preview-row"><div class="preview-label">심사</div><div class="preview-value">${data.screeningType}</div></div>`;
    if (data.paymentPeriod || data.coveragePeriod) html += `<div class="preview-row"><div class="preview-label">기간</div><div class="preview-value">${data.paymentPeriod || '-'} / ${data.coveragePeriod || '-'}</div></div>`;
    if (data.refundType) html += `<div class="preview-row"><div class="preview-label">환급</div><div class="preview-value">${data.refundType}</div></div>`;
    if (data.clientAdditionalInfo) html += `<div class="preview-row"><div class="preview-label">추가정보</div><div class="preview-value">${data.clientAdditionalInfo}</div></div>`;
    
    document.getElementById('preview-card').innerHTML = html;
}

function renderInsurerSelection() {
    const container = document.getElementById('final-insurer-chips');
    const insurerList = currentInsuranceType === 'life' ? LIFE_INSURERS : INSURERS;
    const insurerLogos = currentInsuranceType === 'life' ? LIFE_INSURER_LOGOS : INSURER_LOGOS;
    const selectedInsurers = currentInsuranceType === 'life' ? appState.selectedLifeInsurers : appState.selectedNonlifeInsurers;
    
    let html = '';
    insurerList.forEach(insurer => {
        const logoUrl = insurerLogos[insurer] || 'https://via.placeholder.com/200x200';
        const isSelected = selectedInsurers.includes(insurer) ? 'selected' : '';
        html += `<div class="insurer-logo-item ${isSelected}" data-insurer="${insurer}"><img src="${logoUrl}" alt="${insurer}" class="insurer-logo-img"></div>`;
    });
    
    container.innerHTML = html;
    document.querySelectorAll('.insurer-logo-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('selected');
            updateShareButtons();
        });
    });
}

function updateShareButtons() {
    const selectedItems = document.querySelectorAll('.insurer-logo-item.selected');
    
    if (currentInsuranceType === 'life') {
        appState.selectedLifeInsurers = Array.from(selectedItems).map(item => item.dataset.insurer);
    } else {
        appState.selectedNonlifeInsurers = Array.from(selectedItems).map(item => item.dataset.insurer);
    }
    
    appState.selectedInsurers = [...appState.selectedNonlifeInsurers, ...appState.selectedLifeInsurers];
    
    const container = document.getElementById('share-buttons-container');
    
    if (appState.selectedInsurers.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 20px;">전달할 보험사를 선택해주세요</p>';
        return;
    }
    
    let html = '';
    appState.selectedInsurers.forEach(insurer => {
        const isShared = appState.sharedInsurers.includes(insurer);
        html += `<button class="share-btn-insurer" onclick="shareToInsurer('${insurer}')" ${isShared ? 'disabled' : ''}><i class="ii ii-kakaotalk" style="margin-right: 8px;"></i> ${isShared ? `${insurer} 매니저에게 전달완료` : `${insurer} 매니저에게 전달`}</button>`;
    });
    
    container.innerHTML = html;
}

async function shareToInsurer(insurerName) {
    if (!appState.selectedInsurers.includes(insurerName)) {
        showToast('선택되지 않은 보험사입니다', 'error');
        return;
    }
    
    if (appState.sharedInsurers.includes(insurerName)) {
        showToast('이미 공유된 보험사입니다', 'info');
        return;
    }
    
    if (typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
        showToast('카카오톡 SDK를 초기화할 수 없습니다', 'error');
        return;
    }
    
    const data = appState.formData;
    const commissionCode = insurerCommissionCodes[insurerName] || '입력안함';
    let productsText = data.products.length <= 3 
        ? data.products.join(', ') 
        : data.products.slice(0, 3).join(', ') + ` (+외 ${data.products.length - 3})`;
    
    let insurerText = `[${insurerName} 설계의뢰입니다]\n\n`;
    insurerText += `• 고객: ${data.clientName}\n`;
    insurerText += `• 생년월일/연령대: ${data.clientBirth}\n`;
    
    if (data.insuranceAge !== null) {
        insurerText += `• 보험상령나이: ${data.insuranceAge}세\n`;
    }
    
    insurerText += `• 담보: ${productsText}\n`;
    insurerText += `• 예산: ${data.premiumMin}~${data.premiumMax}만원\n`;
    if (data.medicalInfo) insurerText += `• ${data.medicalInfo}\n`;
    if (data.screeningType) insurerText += `• 심사: ${data.screeningType}\n`;
    if (data.paymentPeriod || data.coveragePeriod) insurerText += `• 기간: ${data.paymentPeriod || '-'} / ${data.coveragePeriod || '-'}\n`;
    if (data.refundType) insurerText += `• 환급: ${data.refundType}\n`;
    if (data.clientAdditionalInfo) insurerText += `• 추가정보: ${data.clientAdditionalInfo}\n`;
    insurerText += `\n• 설계사 위촉코드: ${commissionCode}`;
    
    try {
        Kakao.Link.sendDefault({
            objectType: 'text',
            text: insurerText,
            link: {
                mobileWebUrl: 'https://gaworld.kr/infra',
                webUrl: 'https://gaworld.kr/infra'
            }
        });
        
        await saveRequest(insurerName);
        
        appState.sharedInsurers.push(insurerName);
        updateShareButtons();
        
        const currentCount = appState.sharedInsurers.length;
        const totalCount = appState.selectedInsurers.length;
        
        if (currentCount === totalCount) {
            setTimeout(() => {
                showCompletionModalWithCount(totalCount);
            }, 1000);
        }
        
    } catch (err) {
        console.error('공유 실패:', err);
        showToast('공유 실패', 'error');
    }
}

async function saveRequest(insurerName) {
    if (!supabase || !currentPlannerId) {
        showToast('Supabase 연결 오류', 'error');
        return;
    }
    
    try {
        const requestData = {
            planner_id: currentPlannerId,
            client_name: appState.formData.clientName,
            client_masked: maskName(appState.formData.clientName),
            client_gender: appState.formData.clientGender,
            client_birth: appState.formData.clientBirth,
            medical_info: appState.formData.medicalInfo,
            products_text: appState.formData.products.join(', '),
            premium_min: appState.formData.premiumMin,
            premium_max: appState.formData.premiumMax,
            screening_type: appState.formData.screeningType || '',
            payment_period: appState.formData.paymentPeriod || '',
            coverage_period: appState.formData.coveragePeriod || '',
            refund_type: appState.formData.refundType || '',
            additional_info: appState.formData.clientAdditionalInfo || '',
            delivered_insurers: [insurerName],
            standard_text_kakao: appState.generatedTexts.kakao,
            standard_text_sms: appState.generatedTexts.sms
        };
        
        const { data, error } = await supabase
            .from('requests')
            .insert([requestData])
            .select();
        
        if (error) {
            console.error('DB 저장 실패:', error);
            showToast(`DB 저장 실패: ${error.message}`, 'error');
            return;
        }
        
        console.log('✅ DB 저장 성공');
    } catch (err) {
        console.error('저장 오류:', err);
        showToast(`저장 오류: ${err.message}`, 'error');
    }
}

function maskName(name) {
    if (!name || name.length <= 2) return '**';
    return name.charAt(0) + '*'.repeat(name.length - 1);
}

function showCompletionModal() {
    const count = appState.selectedInsurers.length;
    showCompletionModalWithCount(count);
}

function showCompletionModalWithCount(count) {
    const countText = document.getElementById('completion-count-text');
    if (countText) {
        countText.textContent = `총 ${count}개 보험사에 설계의뢰를 전달했습니다`;
    }
    openSeolmaetalkCompletionModal('seolmaetalk-completion-modal');
}

function goToMypage() {
    closeSeolmaetalkCompletionModal('seolmaetalk-completion-modal');
    resetForm();
    previousTab = 'form';
    switchTab('mypage');
}

function closeCompletionModal() {
    closeSeolmaetalkCompletionModal('seolmaetalk-completion-modal');
    resetForm();
}

function resetForm() {
    document.getElementById('client-name').value = '';
    document.getElementById('gender-male').checked = false;
    document.getElementById('gender-female').checked = false;
    document.getElementById('birth-year').value = '';
    document.getElementById('birth-month').value = '';
    document.getElementById('birth-day').value = '';
    document.getElementById('age-range-select').value = '';
    document.getElementById('client-additional-info').value = '';
    document.getElementById('premium-min').value = '';
    document.getElementById('premium-max').value = '';
    document.getElementById('screening-type').value = '';
    document.getElementById('payment-period').value = '';
    document.getElementById('coverage-period').value = '';
    document.getElementById('refund-type').value = '';
    
    const insuranceAgeDisplay = document.getElementById('insurance-age-display');
    if (insuranceAgeDisplay) insuranceAgeDisplay.style.display = 'none';
    
    document.querySelectorAll('input[name="medical-history"]').forEach(r => r.checked = false);
    document.querySelectorAll('.chip.selected').forEach(c => c.classList.remove('selected'));
    
    appState.selectedProducts = [];
    appState.selectedNonlifeInsurers = [];
    appState.selectedLifeInsurers = [];
    appState.selectedInsurers = [];
    appState.sharedInsurers = [];
    currentInsuranceType = 'nonlife';
    
    goToStep(1);
}

async function loadRequests() {
    const container = document.getElementById('request-list');
    if (!supabase || !currentPlannerId) {
        container.innerHTML = '<p class="text-center" style="color: var(--muted);">로그인이 필요합니다</p>';
        return;
    }
    
    try {
        const { data } = await supabase.from('requests').select('*').eq('planner_id', currentPlannerId).order('created_at', { ascending: false }).limit(100);
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p class="text-center" style="color: var(--muted);">아직 설계의뢰 내역이 없습니다</p>';
            return;
        }
        
        allRequests = data;
        renderRequestList(data);
    } catch (err) {
        container.innerHTML = '<p class="text-center" style="color: var(--error);">불러오기에 실패했습니다</p>';
    }
}

function applyFilters() {
    const searchKeyword = document.getElementById('unified-search-box').value.toLowerCase().trim();
    const sortType = document.getElementById('sort-type').value;
    
    let filtered = allRequests.filter(req => {
        if (!searchKeyword) return true;
        
        const matchName = (req.client_name || '').toLowerCase().includes(searchKeyword);
        const matchInsurer = req.delivered_insurers?.some(ins => ins.toLowerCase().includes(searchKeyword));
        const matchMedical = (req.medical_info || '').toLowerCase().includes(searchKeyword);
        const matchProducts = (req.products_text || '').toLowerCase().includes(searchKeyword);
        
        return matchName || matchInsurer || matchMedical || matchProducts;
    });
    
    if (sortType === 'latest') {
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortType === 'oldest') {
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortType === 'name') {
        filtered.sort((a, b) => (a.client_name || '').localeCompare(b.client_name || ''));
    }
    
    renderRequestList(filtered);
}

function renderRequestList(requests) {
    const container = document.getElementById('request-list');
    
    if (!requests || requests.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: var(--muted); padding: 20px;">검색 결과가 없습니다</p>';
        return;
    }
    
    let html = '';
    requests.forEach(req => {
        const date = new Date(req.created_at).toLocaleDateString('ko-KR');
        
        const products = req.products_text?.split(',').slice(0, 2).map(p => p.trim()).join(' · ') || '상품미지정';
        const hasMoreProducts = req.products_text?.split(',').length > 2;
        
        const budget = `${req.premium_min}~${req.premium_max}만원`;
        
        const insurers = req.delivered_insurers || [];
        let logosHtml = '';
        
        insurers.slice(0, 3).forEach(insurer => {
            const logoUrl = INSURER_LOGOS[insurer] || LIFE_INSURER_LOGOS[insurer] || '';
            if (logoUrl) {
                logosHtml += `<div class="request-logo-box" title="${insurer}"><img src="${logoUrl}" alt="${insurer}"></div>`;
            }
        });
        
        if (insurers.length > 3) {
            logosHtml += `<div class="request-logo-more">+${insurers.length - 3}</div>`;
        }
        
        html += `
            <div class="request-item" data-request-id="${req.id}">
                <div class="request-left">
                    <div class="request-date">${date}</div>
                    <div class="request-client-name">${req.client_name}</div>
                    <div class="request-meta">
                        <div class="request-meta-item">${products}${hasMoreProducts ? ' +' : ''}</div>
                        <div class="request-meta-item">${budget}</div>
                    </div>
                </div>
                
                <div class="request-logos">
                    ${logosHtml}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    container.querySelectorAll('.request-item').forEach(item => {
        item.addEventListener('click', () => {
            const requestId = item.dataset.requestId;
            showRequestDetail(requestId);
        });
    });
}

async function showRequestDetail(requestId) {
    currentDetailId = requestId;
    if (!supabase) return;
    
    document.getElementById('header-back-btn').classList.remove('hidden-btn');
    previousTab = 'mypage';
    
    try {
        const { data } = await supabase.from('requests').select('*').eq('id', requestId).single();
        if (!data) return;
        
        currentDetailData = data;
        
        const date = new Date(data.created_at).toLocaleString('ko-KR');
        
        let html = `
            <h2 class="card-title" style="margin-bottom: 24px;">의뢰 상세</h2>
            
            <div class="detail-info-card">
                <div class="detail-info-row">
                    <div class="detail-info-label">작성일시</div>
                    <div class="detail-info-value">${date}</div>
                </div>
                <div class="detail-info-row">
                    <div class="detail-info-label">고객명</div>
                    <div class="detail-info-value">${data.client_name}</div>
                </div>
        `;
        
        if (data.delivered_insurers?.length > 0) {
            html += `
                <div class="detail-info-row">
                    <div class="detail-info-label">전달 보험사</div>
                    <div class="detail-info-value">${data.delivered_insurers.join(', ')}</div>
                </div>
            `;
        }
        
        html += `</div>`;
        
        html += `
            <div class="detail-text-card">
                <div class="detail-text-title">카카오톡용 텍스트</div>
                <div class="detail-text-content">${data.standard_text_kakao}</div>
            </div>
        `;
        
        html += `<div class="detail-share-buttons">`;
        
        html += `
            <button class="detail-other-insurer-btn" onclick="showOtherInsurersModal()">
                <i class="fi fi-sr-share"></i> 타보험사로 공유
            </button>
        `;
        
        html += `</div>`;
        
        document.getElementById('detail-content-inline').innerHTML = html;
        
        document.getElementById('mypage-list-view').style.display = 'none';
        document.getElementById('mypage-detail-view').style.display = 'block';
        
    } catch (err) {
        console.error('상세 로드 실패:', err);
        showToast('상세 정보를 불러올 수 없습니다', 'error');
    }
}

function showRequestList() {
    document.getElementById('mypage-list-view').style.display = 'block';
    document.getElementById('mypage-detail-view').style.display = 'none';
    document.getElementById('header-back-btn').classList.add('hidden-btn');
    previousTab = null;
}

async function loadCredentials() {
    renderNonlifeCredentialsForm();
}

function switchCredentialMode(mode) {
    currentCredentialMode = mode;
    
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const nonlifeSection = document.getElementById('nonlife-credentials-section');
    const lifeSection = document.getElementById('life-credentials-section');
    
    if (mode === '손해보험') {
        nonlifeSection.style.display = 'block';
        lifeSection.style.display = 'none';
        renderNonlifeCredentialsForm();
    } else {
        nonlifeSection.style.display = 'none';
        lifeSection.style.display = 'block';
        renderLifeCredentialsForm();
    }
}

function renderNonlifeCredentialsForm() {
    let html = '';
    INSURERS.forEach((insurer) => {
        const logoUrl = INSURER_LOGOS[insurer] || 'https://via.placeholder.com/200x200';
        const savedCode = insurerCommissionCodes[insurer] || '';
        html += `<div class="credentials-item"><div class="credentials-logo"><img src="${logoUrl}" alt="${insurer}"></div><div class="credentials-input-wrapper"><input type="text" class="credentials-code-input" data-insurer="${insurer}" placeholder="위촉코드" value="${savedCode}"></div></div>`;
    });
    
    document.getElementById('nonlife-insurers-container').innerHTML = html;
}

function renderLifeCredentialsForm() {
    let html = '';
    LIFE_INSURERS.forEach((insurer) => {
        const logoUrl = LIFE_INSURER_LOGOS[insurer] || 'https://via.placeholder.com/200x200';
        const savedCode = insurerCommissionCodes[insurer] || '';
        html += `<div class="credentials-item"><div class="credentials-logo"><img src="${logoUrl}" alt="${insurer}"></div><div class="credentials-input-wrapper"><input type="text" class="credentials-code-input" data-insurer="${insurer}" placeholder="위촉코드" value="${savedCode}"></div></div>`;
    });
    
    document.getElementById('life-insurers-container').innerHTML = html;
}

async function saveAllCredentials(type = 'nonlife') {
    if (!supabase || !currentPlannerId) {
        showToast('로그인이 필요합니다', 'error');
        return;
    }
    
    const codeInputs = document.querySelectorAll('.credentials-code-input');
    const credentialsToSave = [];
    
    codeInputs.forEach(codeInput => {
        const insurer = codeInput.dataset.insurer;
        const code = codeInput.value.trim();
        if (code) {
            credentialsToSave.push({ 
                planner_id: currentPlannerId, 
                insurer_name: insurer, 
                commission_code: code, 
                type: type === 'life' ? '생명보험' : '손해보험'
            });
        }
    });
    
    if (credentialsToSave.length === 0) {
        showToast('최소 1개 이상의 위촉코드를 입력해주세요', 'error');
        return;
    }
    
    try {
        let updatedCount = 0;
        
        for (const credential of credentialsToSave) {
            const existingCode = insurerCommissionCodes[credential.insurer_name];
            
            if (!existingCode || existingCode !== credential.commission_code) {
                const { error } = await supabase
                    .from('insurer_credentials')
                    .upsert(credential, { onConflict: 'planner_id,insurer_name' });
                
                if (!error) {
                    insurerCommissionCodes[credential.insurer_name] = credential.commission_code;
                    updatedCount++;
                }
            }
        }
        
        if (updatedCount > 0) {
            showToast(`✅ ${updatedCount}개 위촉코드가 저장되었습니다!`, 'success');
        } else {
            showToast('변경된 위촉코드가 없습니다', 'info');
        }
        
        if (type === 'life') {
            renderLifeCredentialsForm();
        } else {
            renderNonlifeCredentialsForm();
        }
    } catch (err) {
        console.error('저장 실패:', err);
        showToast('저장에 실패했습니다', 'error');
    }
}

// ============================================
// 대시보드 렌더링 함수들
// ============================================

function renderSummaryCards(data, insurerStats) {
    const total = data.length;
    const daysInMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
    ).getDate();
    const avgDaily = (total / daysInMonth).toFixed(1);
    
    const html = `
        <div style="background: white; border: 1px solid #E5E0D8; border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="flex: 1;">
                <div style="font-size: 13px; color: #999999; font-weight: 600; margin-bottom: 4px; letter-spacing: 0.5px;">이달 총 의뢰</div>
                <div style="display: flex; align-items: baseline; gap: 8px;">
                    <div class="counter-total" data-target="${total}" style="font-size: 60px; font-weight: 800; color: #191919; line-height: 1;">0</div>
                    <div style="font-size: 13px; color: #999999; font-weight: 500;">건의 설계의뢰</div>
                </div>
            </div>
        </div>
        
        <div style="background: white; border: 1px solid #E5E0D8; border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="flex: 1;">
                <div style="font-size: 13px; color: #999999; font-weight: 600; margin-bottom: 4px; letter-spacing: 0.5px;">1일 평균</div>
                <div style="display: flex; align-items: baseline; gap: 8px;">
                    <div class="counter-average" data-target="${avgDaily}" style="font-size: 60px; font-weight: 800; color: #058240; line-height: 1;">0</div>
                    <div style="font-size: 13px; color: #999999; font-weight: 500;">1일 평균 의뢰</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('summary-cards').innerHTML = html;
    
    setTimeout(() => {
        animateCounters();
    }, 100);
}

function animateCounters() {
    animateCounter('.counter-total', true);
    animateCounter('.counter-average', false);
}

function animateCounter(selector, isInteger) {
    const counterElement = document.querySelector(selector);
    if (!counterElement) return;
    
    const target = parseFloat(counterElement.dataset.target);
    const duration = 1500;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            counterElement.textContent = isInteger ? target : target.toFixed(1);
            clearInterval(timer);
        } else {
            counterElement.textContent = isInteger ? Math.floor(current) : current.toFixed(1);
        }
    }, 16);
}

function renderCustomerAnalysis(ageStats, genderStats, medicalStats) {
    const sortedAges = Object.entries(ageStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    const totalAge = Object.values(ageStats).reduce((a, b) => a + b, 0) || 1;
    const ageGradients = ['#058240', '#87c25a', '#aecacc'];
    
    let ageHtml = '';
    sortedAges.forEach(([age, count], index) => {
        const percent = ((count / totalAge) * 100).toFixed(0);
        ageHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 5px;">
                <span style="font-size: 13px; font-weight: 600; color: #191919; white-space: nowrap;">${age}</span>
                <div style="flex: 1; height: 6px; background: #E5E0D8; border-radius: 3px; min-width: 60px;"><div style="height: 100%; background: ${ageGradients[index]}; width: ${percent}%; border-radius: 3px;"></div></div>
                <span style="font-size: 14px; font-weight: 700; color: #058240; min-width: 30px; text-align: right; white-space: nowrap;">${percent}%</span>
            </div>
        `;
    });
    
    const totalGender = Object.values(genderStats).reduce((a, b) => a + b, 0) || 1;
    let genderHtml = '';
    Object.entries(genderStats).forEach(([gender, count]) => {
        const percent = ((count / totalGender) * 100).toFixed(0);
        const color = gender === '남성' ? '#058240' : '#E74C3C';
        
        genderHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 5px;">
                <span style="font-size: 13px; font-weight: 600; color: #191919; white-space: nowrap;">${gender}</span>
                <div style="flex: 1; height: 6px; background: #E5E0D8; border-radius: 3px; min-width: 60px;"><div style="height: 100%; background: ${color}; width: ${percent}%; border-radius: 3px;"></div></div>
                <span style="font-size: 14px; font-weight: 700; color: ${color}; min-width: 30px; text-align: right; white-space: nowrap;">${percent}%</span>
            </div>
        `;
    });
    
    const totalMedical = Object.values(medicalStats).reduce((a, b) => a + b, 0) || 1;
    let medicalHtml = '';
    Object.entries(medicalStats).forEach(([medical, count]) => {
        const percent = ((count / totalMedical) * 100).toFixed(0);
        const color = medical === '없음' ? '#87c25a' : '#f7cc3d';
        const label = medical === '없음' ? '없음' : '있음';
        
        medicalHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 5px;">
                <span style="font-size: 13px; font-weight: 600; color: #191919; white-space: nowrap;">${label}</span>
                <div style="flex: 1; height: 6px; background: #E5E0D8; border-radius: 3px; min-width: 60px;"><div style="height: 100%; background: ${color}; width: ${percent}%; border-radius: 3px;"></div></div>
                <span style="font-size: 14px; font-weight: 700; color: ${color}; min-width: 30px; text-align: right; white-space: nowrap;">${percent}%</span>
            </div>
        `;
    });
    
    const ageContent = document.getElementById('age-analysis-content');
    const genderContent = document.getElementById('gender-analysis-content');
    const medicalContent = document.getElementById('medical-analysis-content');
    
    if (ageContent) ageContent.innerHTML = ageHtml;
    if (genderContent) genderContent.innerHTML = genderHtml;
    if (medicalContent) medicalContent.innerHTML = medicalHtml;
}

// ============================================
// v2.6 스택 바 렌더링 (도넛 차트 대체)
// ============================================

function renderStackedBarChart(targetId, title, stats) {
    const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
    
    const top5 = sorted.slice(0, 5);
    const others = sorted.slice(5);
    const othersSum = others.reduce((sum, [, count]) => sum + count, 0);
    
    const displayData = [...top5];
    if (othersSum > 0) {
        displayData.push(['기타', othersSum]);
    }
    
    const total = Object.values(stats).reduce((a, b) => a + b, 0) || 1;
    
    const colors = ['#f7cc3d', '#ffe3a2', '#aecacc', '#87c25a', '#058240', '#a19d92'];
    
    // 스택 바 세그먼트
    let barHtml = '';
    displayData.forEach(([name, count], i) => {
        const percent = ((count / total) * 100).toFixed(1);
        barHtml += `<div class="stacked-segment" style="width: ${percent}%; background: ${colors[i]}; --target-width: ${percent}%;" title="${name}: ${percent}%"></div>`;
    });
    
    // 범례 리스트
    let legendHtml = '';
    displayData.forEach(([name, count], i) => {
        const percent = ((count / total) * 100).toFixed(1);
        const rankLabel = i < 5 ? `${i + 1}` : '∙';
        
        legendHtml += `
            <div class="stacked-legend-item">
                <div class="stacked-legend-rank" style="background: ${colors[i]};">${rankLabel}</div>
                <span class="stacked-legend-name">${name}</span>
                <span class="stacked-legend-value">${percent}%</span>
                <span class="stacked-legend-count">${count}건</span>
            </div>
        `;
    });
    
    const fullHtml = `
        <div style="background: white; border-radius: 16px; border: 1px solid #E5E0D8; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">
            <div style="padding: 20px 24px; background: #F9F9F4; border-bottom: 1px solid #E5E0D8;">
                <h3 style="font-weight: 700; font-size: 15px; color: #191919; margin: 0;"><span class="section-indicator"></span>${title}</h3>
            </div>
            <div style="padding: 24px;">
                <div class="stacked-bar-wrapper">
                    <div class="stacked-bar">${barHtml}</div>
                </div>
                <div class="stacked-legend">${legendHtml}</div>
            </div>
        </div>
    `;
    
    document.getElementById(targetId).innerHTML = fullHtml;
}

function renderRankingTable(insurerStats) {
    renderStackedBarChart('ranking-table-card', 'MY TOP 5 보험사', insurerStats);
}

function renderProductsRanking(productsStats) {
    renderStackedBarChart('products-ranking-card', '담보(상품군)별 의뢰 비중', productsStats);
}

function renderMonthComparison(currentData, previousData) {
    const currentCount = currentData?.length || 0;
    const previousCount = previousData?.length || 0;
    const change = currentCount - previousCount;
    const changePercent = previousCount > 0 ? ((Math.abs(change) / previousCount) * 100).toFixed(1) : 0;
    
    const isIncrease = change >= 0;
    const changeColor = isIncrease ? '#058240' : '#E74C3C';
    const changeIcon = isIncrease ? '▲' : '▼';
    const changeBg = isIncrease ? '#E8F5E9' : '#FDEDEC';
    
    const html = `
        <div style="background: white; border-radius: 16px; padding: 24px; border: 1px solid #E5E0D8; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
            <h3 style="font-weight: 700; margin-bottom: 20px; font-size: 15px; color: #191919;"><span class="section-indicator"></span>전월 비교분석</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                <div style="text-align: center; padding: 20px; background: #FFFBE6; border-radius: 12px; border: 1px solid #FEE500;">
                    <div style="font-size: 12px; color: #058240; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.5px;">이번달</div>
                    <div style="font-size: 32px; font-weight: 800; color: #191919; line-height: 1;">${currentCount}</div>
                    <div style="font-size: 12px; color: #999999; margin-top: 6px;">건</div>
                </div>
                
                <div style="text-align: center; padding: 20px; background: #F5F3ED; border-radius: 12px; border: 1px solid #E5E0D8;">
                    <div style="font-size: 12px; color: #999999; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.5px;">지난달</div>
                    <div style="font-size: 32px; font-weight: 800; color: #999999; line-height: 1;">${previousCount}</div>
                    <div style="font-size: 12px; color: #BBBBBB; margin-top: 6px;">건</div>
                </div>
                
                <div style="text-align: center; padding: 20px; background: ${changeBg}; border-radius: 12px; border: 1px solid ${changeColor}20;">
                    <div style="font-size: 12px; color: ${changeColor}; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.5px;">${isIncrease ? '증가' : '감소'}</div>
                    <div style="font-size: 32px; font-weight: 800; color: ${changeColor}; line-height: 1;">${changeIcon} ${Math.abs(change)}</div>
                    <div style="font-size: 12px; color: ${changeColor}; margin-top: 6px;">전월대비 ${changePercent}%</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('month-comparison-card').innerHTML = html;
}

function renderLast7DaysChart(last7DaysStats) {
    const today = new Date();
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        dates.push(date.toISOString().split('T')[0]);
    }
    
    const data = dates.map(date => ({
        date: date.split('-')[2],
        count: last7DaysStats[date] || 0
    }));
    
    const maxCount = Math.max(...data.map(d => d.count), 1);
    
    const chartHeight = 140;
    const chartWidth = 500;
    const padLeft = 40;
    const padRight = 40;
    const viewBoxWidth = chartWidth + padLeft + padRight;
    const pointSpacing = chartWidth / 6;
    
    let pointsArray = [];
    let circlesHtml = '';
    let barsHtml = '';
    
    data.forEach((item, index) => {
        const x = padLeft + index * pointSpacing;
        const y = chartHeight - (item.count / maxCount) * chartHeight;
        
        const barHeight = (item.count / maxCount) * chartHeight;
        
        barsHtml += `<rect class="chart-bar" x="${x - 16}" y="${chartHeight - barHeight}" width="32" height="${barHeight}" fill="#87c25a" opacity="0.7" rx="4" style="--bar-height: ${barHeight}px;"/>`;
        
        pointsArray.push({ x, y, index });
        
        circlesHtml += `<circle class="chart-point" cx="${x}" cy="${y}" r="5" fill="white" stroke="#058240" stroke-width="2"/>`;
    });
    
    let pathData = pointsArray.map(p => `${p.x},${p.y}`).join(' ');
    
    let pathLength = 0;
    for (let i = 0; i < pointsArray.length - 1; i++) {
        const p1 = pointsArray[i];
        const p2 = pointsArray[i + 1];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        pathLength += Math.sqrt(dx * dx + dy * dy);
    }
    
    const dateTexts = data.map((item, index) => {
        const x = padLeft + index * pointSpacing;
        return `<text class="chart-text" x="${x}" y="180" text-anchor="middle" font-size="13" fill="#999999" font-weight="600">${item.date}</text>`;
    }).join('');
    
    const svg = `
        <svg width="100%" height="220" viewBox="0 0 ${viewBoxWidth} 220" preserveAspectRatio="xMidYMid meet" style="display: block; margin: 0 auto;">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#87c25a;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#87c25a;stop-opacity:0" />
                </linearGradient>
                <style>
                    .chart-bar {
                        animation: barGrow 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                        opacity: 0;
                    }
                    .chart-bar:nth-child(1) { animation-delay: 0.1s; }
                    .chart-bar:nth-child(2) { animation-delay: 0.16s; }
                    .chart-bar:nth-child(3) { animation-delay: 0.22s; }
                    .chart-bar:nth-child(4) { animation-delay: 0.28s; }
                    .chart-bar:nth-child(5) { animation-delay: 0.34s; }
                    .chart-bar:nth-child(6) { animation-delay: 0.4s; }
                    .chart-bar:nth-child(7) { animation-delay: 0.46s; }
                    
                    .chart-line {
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        animation: lineDrawing 1s ease-out 0.6s forwards;
                        stroke-dasharray: ${pathLength};
                        stroke-dashoffset: ${pathLength};
                        opacity: 0;
                    }
                    
                    .chart-point {
                        animation: pointPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                        opacity: 0;
                    }
                    .chart-point:nth-child(1) { animation-delay: 1.1s; }
                    .chart-point:nth-child(2) { animation-delay: 1.15s; }
                    .chart-point:nth-child(3) { animation-delay: 1.2s; }
                    .chart-point:nth-child(4) { animation-delay: 1.25s; }
                    .chart-point:nth-child(5) { animation-delay: 1.3s; }
                    .chart-point:nth-child(6) { animation-delay: 1.35s; }
                    .chart-point:nth-child(7) { animation-delay: 1.4s; }
                    
                    .chart-text {
                        animation: textFadeIn 0.5s ease-out 1.4s forwards;
                        opacity: 0;
                    }
                    
                    @keyframes barGrow {
                        from { height: 0; opacity: 0; }
                        to { height: var(--bar-height); opacity: 1; }
                    }
                    
                    @keyframes lineDrawing {
                        from { stroke-dashoffset: ${pathLength}; opacity: 0; }
                        to { stroke-dashoffset: 0; opacity: 1; }
                    }
                    
                    @keyframes pointPop {
                        0% { r: 0; opacity: 0; }
                        60% { r: 7px; }
                        100% { r: 5px; opacity: 1; }
                    }
                    
                    @keyframes textFadeIn {
                        from { opacity: 0; transform: translateY(8px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                </style>
            </defs>
            
            <line x1="${padLeft}" y1="${chartHeight}" x2="${padLeft + chartWidth}" y2="${chartHeight}" stroke="#E5E0D8" stroke-width="1"/>
            
            ${barsHtml}
            
            <polyline class="chart-line" points="${pathData}" fill="none" stroke="#058240" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            
            ${circlesHtml}
            
            ${dateTexts}
        </svg>
    `;
    
    document.getElementById('last-7days-chart').innerHTML = svg;
}

function selectDatePreset(preset) {
    currentDateRange = { preset, startDate: null, endDate: null };
    
    document.querySelectorAll('.period-preset-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.preset === preset) btn.classList.add('active');
    });
    
    const customRangeDiv = document.getElementById('custom-date-range');
    if (preset === 'custom') {
        customRangeDiv.style.display = 'flex';
    } else {
        customRangeDiv.style.display = 'none';
        loadDashboardData();
    }
}

function applyCustomDateRange() {
    const startDate = document.getElementById('range-start-date').value;
    const endDate = document.getElementById('range-end-date').value;
    
    if (!startDate || !endDate) {
        showToast('시작일과 종료일을 모두 선택해주세요', 'error');
        return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        showToast('시작일이 종료일보다 클 수 없습니다', 'error');
        return;
    }
    
    currentDateRange = { preset: 'custom', startDate, endDate };
    loadDashboardData();
}

function getDateRange() {
    const today = new Date();
    let startDate, endDate;
    
    if (currentDateRange.preset === 'custom') {
        startDate = currentDateRange.startDate;
        endDate = currentDateRange.endDate;
    } else if (currentDateRange.preset === '7days') {
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
    } else if (currentDateRange.preset === '30days') {
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
    } else if (currentDateRange.preset === '90days') {
        startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
    }
    
    return { startDate, endDate };
}

async function loadDashboardData() {
    if (!supabase || !currentPlannerId) {
        showToast('로그인이 필요합니다', 'error');
        return;
    }
    
    const { startDate, endDate } = getDateRange();
    
    try {
        const { data: rangeData } = await supabase
            .from('requests')
            .select('*')
            .eq('planner_id', currentPlannerId)
            .gte('created_at', `${startDate}T00:00:00`)
            .lte('created_at', `${endDate}T23:59:59`);
        
        const sevenDaysAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        const { data: last7DaysData } = await supabase
            .from('requests')
            .select('*')
            .eq('planner_id', currentPlannerId)
            .gte('created_at', `${sevenDaysAgo}T00:00:00`)
            .lte('created_at', `${today}T23:59:59`);
        
        // 전월 비교 데이터
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const thisMonthEnd = now.toISOString().split('T')[0];
        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
        const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
        
        const { data: currentMonthData } = await supabase
            .from('requests')
            .select('*')
            .eq('planner_id', currentPlannerId)
            .gte('created_at', `${thisMonthStart}T00:00:00`)
            .lte('created_at', `${thisMonthEnd}T23:59:59`);
        
        const { data: previousMonthData } = await supabase
            .from('requests')
            .select('*')
            .eq('planner_id', currentPlannerId)
            .gte('created_at', `${prevMonthStart}T00:00:00`)
            .lte('created_at', `${prevMonthEnd}T23:59:59`);
        
        if (!rangeData) {
            showToast('데이터를 불러올 수 없습니다', 'error');
            return;
        }
        
        const insurerStats = {};
        const ageStats = {};
        const genderStats = {};
        const medicalStats = { '없음': 0, '있음': 0 };
        const productsStats = {};
        
        rangeData.forEach(req => {
            if (req.delivered_insurers?.length > 0) {
                req.delivered_insurers.forEach(insurer => {
                    insurerStats[insurer] = (insurerStats[insurer] || 0) + 1;
                });
            }
            
            if (req.products_text) {
                const products = req.products_text.split(',').map(p => p.trim());
                products.forEach(product => {
                    if (product) {
                        productsStats[product] = (productsStats[product] || 0) + 1;
                    }
                });
            }
            
            if (req.client_birth) {
                let ageGroup = req.client_birth;
                const dateMatch = req.client_birth?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                
                if (dateMatch) {
                    const [, year, month, day] = dateMatch;
                    const insuranceAge = calculateInsuranceAgeValue(year, month, day);
                    
                    if (insuranceAge !== null) {
                        if (insuranceAge < 10) ageGroup = '10세 미만 아동';
                        else if (insuranceAge < 20) ageGroup = '10대';
                        else if (insuranceAge < 30) ageGroup = '20대';
                        else if (insuranceAge < 40) ageGroup = '30대';
                        else if (insuranceAge < 50) ageGroup = '40대';
                        else if (insuranceAge < 60) ageGroup = '50대';
                        else if (insuranceAge < 70) ageGroup = '60대';
                        else if (insuranceAge < 80) ageGroup = '70대';
                        else ageGroup = '80세 이상';
                    }
                }
                ageStats[ageGroup] = (ageStats[ageGroup] || 0) + 1;
            }
            
            if (req.client_gender) {
                genderStats[req.client_gender] = (genderStats[req.client_gender] || 0) + 1;
            }
            
            if (req.medical_info?.includes('있음')) {
                medicalStats['있음']++;
            } else if (req.medical_info) {
                medicalStats['없음']++;
            }
        });
        
        const last7DaysStats = {};
        last7DaysData?.forEach(req => {
            const date = new Date(req.created_at).toISOString().split('T')[0];
            last7DaysStats[date] = (last7DaysStats[date] || 0) + 1;
        });
        
        // v2.6 순서: 요약 → TOP5 → 담보 → 7일추이 → 전월비교 → 고객분석
        renderSummaryCards(rangeData, insurerStats);
        renderRankingTable(insurerStats);
        renderProductsRanking(productsStats);
        renderLast7DaysChart(last7DaysStats);
        renderMonthComparison(currentMonthData || [], previousMonthData || []);
        renderCustomerAnalysis(ageStats, genderStats, medicalStats);
        
    } catch (err) {
        console.error('❌ 대시보드 데이터 로드 실패:', err);
        showToast('데이터 로드 실패', 'error');
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    if (type === 'error') toast.classList.add('error');
    else if (type === 'success') toast.classList.add('success');
    
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function showOtherInsurersModal() {
    if (!currentDetailData) {
        showToast('의뢰 정보를 불러올 수 없습니다', 'error');
        return;
    }
    
    const deliveredInsurers = currentDetailData.delivered_insurers || [];
    
    const availableNonlifeInsurers = INSURERS.filter(insurer => !deliveredInsurers.includes(insurer));
    const availableLifeInsurers = LIFE_INSURERS.filter(insurer => !deliveredInsurers.includes(insurer));
    
    if (availableNonlifeInsurers.length === 0 && availableLifeInsurers.length === 0) {
        showToast('모든 보험사에 이미 전달되었습니다', 'info');
        return;
    }
    
    selectedOtherInsurers = [];
    currentOtherInsuranceType = 'nonlife';
    
    renderOtherInsurersGrid('nonlife', availableNonlifeInsurers);
    renderOtherInsurersGrid('life', availableLifeInsurers);
    
    document.getElementById('other-nonlife-tab').classList.add('active');
    document.getElementById('other-nonlife-tab').style.color = '#191919';
    document.getElementById('other-nonlife-tab').style.borderBottom = '3px solid #FEE500';
    
    document.getElementById('other-life-tab').classList.remove('active');
    document.getElementById('other-life-tab').style.color = '#999999';
    document.getElementById('other-life-tab').style.borderBottom = 'none';
    
    document.getElementById('other-nonlife-insurers-grid').style.display = 'grid';
    document.getElementById('other-life-insurers-grid').style.display = 'none';
    
    updateOtherShareButtons();
    openSeolmaetalkCompletionModal('other-insurers-modal');
}

function renderOtherInsurersGrid(type, insurers) {
    const gridId = type === 'life' ? 'other-life-insurers-grid' : 'other-nonlife-insurers-grid';
    const logos = type === 'life' ? LIFE_INSURER_LOGOS : INSURER_LOGOS;
    const grid = document.getElementById(gridId);
    
    let html = '';
    insurers.forEach(insurer => {
        const logoUrl = logos[insurer] || 'https://via.placeholder.com/200x200';
        html += `<div class="other-insurer-item" data-insurer="${insurer}" data-type="${type}"><img src="${logoUrl}" alt="${insurer}"></div>`;
    });
    
    if (insurers.length === 0) {
        html = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 40px;">전달 가능한 보험사가 없습니다</p>';
    }
    
    grid.innerHTML = html;
    
    grid.querySelectorAll('.other-insurer-item').forEach(item => {
        item.addEventListener('click', () => {
            toggleOtherInsurer(item.dataset.insurer);
        });
    });
}

function switchOtherInsuranceType(type) {
    currentOtherInsuranceType = type;
    
    const nonlifeTab = document.getElementById('other-nonlife-tab');
    const lifeTab = document.getElementById('other-life-tab');
    const nonlifeGrid = document.getElementById('other-nonlife-insurers-grid');
    const lifeGrid = document.getElementById('other-life-insurers-grid');
    
    if (type === 'nonlife') {
        nonlifeTab.classList.add('active');
        nonlifeTab.style.color = '#191919';
        nonlifeTab.style.borderBottom = '3px solid #FEE500';
        
        lifeTab.classList.remove('active');
        lifeTab.style.color = '#999999';
        lifeTab.style.borderBottom = 'none';
        
        nonlifeGrid.style.display = 'grid';
        lifeGrid.style.display = 'none';
    } else {
        lifeTab.classList.add('active');
        lifeTab.style.color = '#191919';
        lifeTab.style.borderBottom = '3px solid #FEE500';
        
        nonlifeTab.classList.remove('active');
        nonlifeTab.style.color = '#999999';
        nonlifeTab.style.borderBottom = 'none';
        
        lifeGrid.style.display = 'grid';
        nonlifeGrid.style.display = 'none';
    }
}

function closeOtherInsurersModal() {
    selectedOtherInsurers = [];
    closeSeolmaetalkCompletionModal('other-insurers-modal');
}

function toggleOtherInsurer(insurerName) {
    const allItems = document.querySelectorAll('.other-insurer-item');
    
    allItems.forEach(item => {
        if (item.dataset.insurer === insurerName) {
            item.classList.toggle('selected');
            
            if (item.classList.contains('selected')) {
                if (!selectedOtherInsurers.includes(insurerName)) {
                    selectedOtherInsurers.push(insurerName);
                }
            } else {
                selectedOtherInsurers = selectedOtherInsurers.filter(i => i !== insurerName);
            }
        }
    });
    
    updateOtherShareButtons();
}

function updateOtherShareButtons() {
    const container = document.getElementById('other-share-buttons-container');
    
    if (selectedOtherInsurers.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 20px;">공유할 보험사를 선택해주세요</p>';
        return;
    }
    
    let html = '';
    selectedOtherInsurers.forEach(insurer => {
        html += `<button class="share-btn-insurer" onclick="shareToOneOtherInsurer('${insurer}')"><i class="ii ii-kakaotalk" style="margin-right: 8px;"></i> ${insurer} 매니저에게 전달</button>`;
    });
    
    container.innerHTML = html;
}

async function shareToOneOtherInsurer(insurerName) {
    if (!currentDetailData) {
        showToast('의뢰 정보를 불러올 수 없습니다', 'error');
        return;
    }
    
    if (typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
        showToast('카카오톡 SDK를 초기화할 수 없습니다', 'error');
        return;
    }
    
    const data = currentDetailData;
    const commissionCode = insurerCommissionCodes[insurerName] || '입력안함';
    
    let insuranceAge = null;
    const birthMatch = data.client_birth?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (birthMatch) {
        const [, year, month, day] = birthMatch;
        insuranceAge = calculateInsuranceAgeValue(year, month, day);
    }
    
    let insurerText = `[${insurerName} 설계의뢰입니다]\n\n`;
    insurerText += `• 고객: ${data.client_name}\n`;
    insurerText += `• 생년월일/연령대: ${data.client_birth}\n`;
    
    if (insuranceAge !== null) {
        insurerText += `• 보험상령나이: ${insuranceAge}세\n`;
    }
    
    insurerText += `• 담보: ${data.products_text}\n`;
    insurerText += `• 예산: ${data.premium_min}~${data.premium_max}만원\n`;
    if (data.medical_info) insurerText += `• ${data.medical_info}\n`;
    if (data.screening_type) insurerText += `• 심사: ${data.screening_type}\n`;
    if (data.payment_period || data.coverage_period) insurerText += `• 기간: ${data.payment_period || '-'} / ${data.coverage_period || '-'}\n`;
    if (data.refund_type) insurerText += `• 환급: ${data.refund_type}\n`;
    if (data.additional_info) insurerText += `• 추가정보: ${data.additional_info}\n`;
    insurerText += `\n• 설계사 위촉코드: ${commissionCode}`;
    
    try {
        Kakao.Link.sendDefault({
            objectType: 'text',
            text: insurerText,
            link: {
                mobileWebUrl: 'https://gaworld.kr/infra',
                webUrl: 'https://gaworld.kr/infra'
            }
        });
        
        showToast(`✅ ${insurerName}로 공유되었습니다!`, 'success');
    } catch (err) {
        console.error('공유 실패:', err);
        showToast('공유에 실패했습니다', 'error');
    }
}

// ============================================
// 상단 메뉴바 관련
// ============================================

function updateTopMenuBar(currentTab) {
    const topMenuBar = document.getElementById('top-menu-bar');
    const menuItems = document.querySelectorAll('.top-menu-item');
    
    if (currentTab === 'form') {
        topMenuBar.classList.add('show');
        menuItems.forEach(item => item.classList.remove('active'));
    } else {
        topMenuBar.classList.add('show');
        
        menuItems.forEach(item => item.classList.remove('active'));
        
        if (currentTab === 'mypage') {
            menuItems[1].classList.add('active');
        } else if (currentTab === 'credentials') {
            menuItems[2].classList.add('active');
        } else if (currentTab === 'dashboard') {
            menuItems[3].classList.add('active');
        }
    }
}

function switchTabFromMenu(tabName) {
    previousTab = 'form';
    switchTab(tabName);
}

function goToHomeAndReset() {
    resetForm();
    previousTab = null;
    switchTab('form');
}
</script>
