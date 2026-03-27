<script>
// ============================================
// 설매톡 모달버전 v4.2 — JS (카카오 버튼 문구 변경)
// ============================================

// 갤러리 클릭 가로채기
document.addEventListener('click', function(e) {
    var target = e.target.closest('.item_gallery, .item_container');
    if (target) {
        var parent = target.closest('.item_gallery') || target;
        if (parent.textContent.includes('설계톡')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            openSeolmaetalkModal();
            return false;
        }
    }
}, true);

// ============================================
// 상수 & 데이터
// ============================================
const SUPABASE_URL = 'https://efnqwonydsnqsydaeawk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbnF3b255ZHNucXN5ZGFlYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNzcxMzQsImV4cCI6MjA3Njg1MzEzNH0.GjEAPJtpYj0cwY5aM803dK2jvTyDymvaqnPbctHIKBI';

const INSURERS = ['KB손해보험','흥국화재','삼성화재','메리츠화재','DB손해보험','현대해상','롯데손해보험','한화손해보험','MG손해보험','NH농협손해보험','AIG손해보험','하나손해보험','라이나손보','AXA손해보험'];
const INSURER_LOGOS = {'KB손해보험':'https://cdn.imweb.me/thumbnail/20250406/35b1a73f72aa2.png','흥국화재':'https://cdn.imweb.me/thumbnail/20250406/36efe9b5439ac.png','삼성화재':'https://cdn.imweb.me/thumbnail/20250406/51d6ab2e63cf9.jpg','메리츠화재':'https://cdn.imweb.me/thumbnail/20250406/5215bfefda8d1.png','DB손해보험':'https://cdn.imweb.me/thumbnail/20250406/ae592ed957eb3.png','현대해상':'https://cdn.imweb.me/thumbnail/20250406/8686a18dc6d55.png','롯데손해보험':'https://cdn.imweb.me/thumbnail/20250406/5410261c3a32c.jpg','한화손해보험':'https://cdn.imweb.me/thumbnail/20250406/dd3a588f03f4a.png','MG손해보험':'https://cdn.imweb.me/thumbnail/20250406/c351c4575f774.png','NH농협손해보험':'https://cdn.imweb.me/thumbnail/20250406/79591f0672108.png','AIG손해보험':'https://cdn.imweb.me/thumbnail/20250406/ed22adc06928f.png','하나손해보험':'https://cdn.imweb.me/thumbnail/20250406/5950194539602.png','라이나손보':'https://cdn.imweb.me/thumbnail/20250406/c6524d3906127.jpg','AXA손해보험':'https://cdn.imweb.me/thumbnail/20250406/0022a68d5c762.jpg'};
const LIFE_INSURERS = ['삼성생명','한화생명','교보생명','메트라이프','미래에셋생명','DB생명','흥국생명','NH농협생명','하나생명','KB라이프','신한라이프','iM라이프','KDB생명','BNP파리바카디프생명','라이나생명','동양생명','ABL생명','푸본현대생명','AIA생명','처브라이프','IBK연금보험'];
const LIFE_INSURER_LOGOS = {'삼성생명':'https://cdn.imweb.me/thumbnail/20230526/d2d04019860eb.png','한화생명':'https://cdn.imweb.me/thumbnail/20230526/ef6b3e6312850.png','교보생명':'https://cdn.imweb.me/thumbnail/20230526/6cf4399a3de7f.png','메트라이프':'https://cdn.imweb.me/thumbnail/20230526/c884e2ca6f8f4.png','미래에셋생명':'https://cdn.imweb.me/thumbnail/20230526/bf7106aa51653.png','DB생명':'https://cdn.imweb.me/thumbnail/20230601/d90454c9cf883.jpg','흥국생명':'https://cdn.imweb.me/thumbnail/20230526/43efd1b7b8943.png','NH농협생명':'https://cdn.imweb.me/thumbnail/20230526/a74a5e41a70df.png','하나생명':'https://cdn.imweb.me/thumbnail/20230601/fb7b932cf89f3.jpg','KB라이프':'https://cdn.imweb.me/thumbnail/20230719/d1782d52e0a30.jpg','신한라이프':'https://cdn.imweb.me/thumbnail/20230526/8664352a9d3c8.png','iM라이프':'https://cdn.imweb.me/thumbnail/20240611/7fffa9ef9f92c.jpg','KDB생명':'https://cdn.imweb.me/thumbnail/20230526/5b85593a88fba.png','BNP파리바카디프생명':'https://cdn.imweb.me/thumbnail/20230526/2ede29f63668c.png','라이나생명':'https://cdn.imweb.me/thumbnail/20230526/9782ebc4bfb94.png','동양생명':'https://cdn.imweb.me/thumbnail/20230526/d54c4f9e68824.png','ABL생명':'https://cdn.imweb.me/thumbnail/20230526/d70977f5fdfbb.png','푸본현대생명':'https://cdn.imweb.me/thumbnail/20230526/681dd4a8edc12.jpg','AIA생명':'https://cdn.imweb.me/thumbnail/20230526/b308e6544a250.jpg','처브라이프':'https://cdn.imweb.me/thumbnail/20230526/72476f92ee4fc.jpg','IBK연금보험':'https://cdn.imweb.me/thumbnail/20230526/58c4e57f88ee0.jpg'};

// ============================================
// 전역 변수
// ============================================
let sb=null,currentPlannerId=null,currentPlannerEmail=null,currentPlannerName=null,insurerCommissionCodes={},birthInputMode='birth',currentCredentialMode='손해보험',allRequests=[],previousTab=null,currentInsuranceType='nonlife';
const appState={currentStep:1,formData:{},selectedProducts:[],selectedNonlifeInsurers:[],selectedLifeInsurers:[],selectedInsurers:[],generatedTexts:{kakao:'',sms:''},sharedInsurers:[]};
let currentDateRange={preset:'7days',startDate:null,endDate:null},currentDetailId=null,currentDetailData=null,selectedOtherInsurers=[],currentOtherInsuranceType='nonlife';

// ============================================
// 초기화
// ============================================
document.addEventListener('DOMContentLoaded',async()=>{initKakao();initSupabase();await initUser();initTabs();initChips();initFormInputs();setupBirthdayInput();setupMedicalHistoryRadio();initDraggable();});

function initKakao(){if(typeof Kakao!=='undefined'){if(!Kakao.isInitialized()){Kakao.init('2a2e79669ea6bbbf07f5d68ffa1cc67b');Kakao.Link.createDefaultButton=function(){if(window.open){const originalOpen=window.open;window.open=function(url,name,features){if(!features)features='width=500,height=600,scrollbars=yes,resizable=yes';return originalOpen.call(window,url,name||'_blank',features);};};};}console.log('✅ Kakao SDK 초기화 성공');}else{setTimeout(initKakao,500);}}
function initSupabase(){try{if(typeof window.supabase!=='undefined'){supabase=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);console.log('✅ Supabase 연결 성공');}}catch(err){console.error('❌ Supabase 연결 실패:',err);}}

// ============================================
// 사용자 관리
// ============================================
async function initUser(){const memberInfo=await getImwebMemberInfo();if(memberInfo&&memberInfo.email){currentPlannerEmail=memberInfo.email;currentPlannerName=memberInfo.name;updateMypageTitle(memberInfo.name);updateGreetingText(memberInfo.name);if(supabase){try{let{data}=await supabase.from('planners').select('id').eq('email',memberInfo.email).maybeSingle();if(!data){const{data:newPlanner}=await supabase.from('planners').insert({email:memberInfo.email,name:memberInfo.name||'설계사'}).select().single();if(newPlanner)currentPlannerId=newPlanner.id;}else{currentPlannerId=data.id;}await loadCommissionCodes();}catch(err){console.error('❌ 사용자 정보 처리 실패:',err);}}}}
async function loadCommissionCodes(){if(!supabase||!currentPlannerId)return;try{const{data}=await supabase.from('insurer_credentials').select('insurer_name, commission_code').eq('planner_id',currentPlannerId);if(data){insurerCommissionCodes={};data.forEach(item=>{if(item.commission_code)insurerCommissionCodes[item.insurer_name]=item.commission_code;});}}catch(err){console.error('❌ 위촉코드 로드 실패:',err);}}
async function getImwebMemberInfo(){try{const response=await fetch('/dialog/join.cm',{credentials:'include'});if(response.ok){const html=await response.text();const parser=new DOMParser();const doc=parser.parseFromString(html,'text/html');const nameInput=doc.querySelector('input[name="name"]');const emailInput=doc.querySelector('input[name="email"]');const uidInput=doc.querySelector('input[name="uid"]');if(nameInput&&nameInput.value.trim()){const uid=uidInput?.value.trim()||null;const name=nameInput.value.trim();let email=emailInput?.value.trim()||(uid?`${uid}@imweb.com`:null);if(email&&email.endsWith('@imweb.com'))email=email.substring(0,email.lastIndexOf('@imweb.com'));if(email){const memberInfo={uid,name,email};localStorage.setItem('IMWEB_MEMBER',JSON.stringify(memberInfo));return memberInfo;}}}}catch(err){}try{const cached=localStorage.getItem('IMWEB_MEMBER');if(cached)return JSON.parse(cached);}catch(err){}return null;}
function updateMypageTitle(name){const el=document.getElementById('mypage-title');if(el&&name)el.textContent=`${name}님의 설계의뢰 내역`;}
function updateGreetingText(name){const el=document.getElementById('greeting-text');if(el&&name)el.innerHTML=`${name}님,<br>안녕하세요!<br>설계 요청을 시작해봐요.`;}

// ============================================
// 네비게이션
// ============================================
function initTabs(){document.querySelectorAll('.tab').forEach(tab=>{tab.addEventListener('click',()=>switchTab(tab.dataset.tab));});}
function switchGreetingMode(mode){if(mode==='history'){previousTab='form';switchTab('mypage');}else if(mode==='code'){previousTab='form';switchTab('credentials');}else if(mode==='dashboard'){previousTab='form';switchTab('dashboard');}}
function goToHome(){previousTab=null;switchTab('form');}
function goBack(){const detailView=document.getElementById('mypage-detail-view');if(detailView&&detailView.style.display!=='none'){showRequestList();return;}if(previousTab){switchTab(previousTab);previousTab=null;}else{switchTab('form');}}
function updateBackButtonVisibility(){const backBtn=document.getElementById('header-back-btn');const currentTab=Array.from(document.querySelectorAll('.tab-content')).find(t=>t.classList.contains('active'))?.id;if(currentTab==='form-tab'||previousTab===null)backBtn.classList.add('hidden-btn');else backBtn.classList.remove('hidden-btn');}
function switchTab(tabName){const tabButtons=document.querySelectorAll('.tab');if(tabButtons.length>0){tabButtons.forEach(t=>t.classList.remove('active'));const activeTabBtn=document.querySelector(`[data-tab="${tabName}"]`);if(activeTabBtn)activeTabBtn.classList.add('active');}document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));document.getElementById(`${tabName}-tab`).classList.add('active');updateTopMenuBar(tabName);updateBackButtonVisibility();if(tabName==='mypage'){document.getElementById('mypage-list-view').style.display='block';document.getElementById('mypage-detail-view').style.display='none';loadRequests();}else if(tabName==='credentials'){loadCredentials();}else if(tabName==='dashboard'){loadDashboardData();}}
function updateTopMenuBar(currentTab){const topMenuBar=document.getElementById('top-menu-bar'),menuItems=document.querySelectorAll('.top-menu-item');topMenuBar.classList.add('show');menuItems.forEach(item=>item.classList.remove('active'));if(currentTab==='mypage')menuItems[1].classList.add('active');else if(currentTab==='credentials')menuItems[2].classList.add('active');else if(currentTab==='dashboard')menuItems[3].classList.add('active');}
function switchTabFromMenu(tabName){previousTab='form';switchTab(tabName);}
function goToHomeAndReset(){resetForm();previousTab=null;switchTab('form');}

// ============================================
// 폼 입력
// ============================================
function initChips(){const container=document.getElementById('product-chips');if(!container)return;const newContainer=container.cloneNode(true);container.parentNode.replaceChild(newContainer,container);newContainer.addEventListener('click',(e)=>{const chip=e.target.closest('.chip');if(!chip)return;chip.classList.toggle('selected');const value=chip.dataset.value;if(chip.classList.contains('selected')){if(!appState.selectedProducts.includes(value))appState.selectedProducts.push(value);}else{appState.selectedProducts=appState.selectedProducts.filter(p=>p!==value);}});}
function initFormInputs(){document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input=>{input.addEventListener('change',collectFormData);});}
function calculateInsuranceAgeValue(year,month,day){if(!year||!month||!day)return null;const birthYear=parseInt(year),birthMonth=parseInt(month),birthDay=parseInt(day),currentYear=new Date().getFullYear();if(birthYear>currentYear||birthYear<1900||birthMonth<1||birthMonth>12||birthDay<1||birthDay>31)return null;const today=new Date(),birthDate=new Date(birthYear,birthMonth-1,birthDay);let age=today.getFullYear()-birthDate.getFullYear();const monthDiff=today.getMonth()-birthDate.getMonth();if(monthDiff<0||(monthDiff===0&&today.getDate()<birthDate.getDate()))age--;const lastBirthday=new Date(today.getFullYear(),birthMonth-1,birthDay);if(lastBirthday>today)lastBirthday.setFullYear(today.getFullYear()-1);const daysSinceBirthday=(today-lastBirthday)/(1000*60*60*24);const monthsSinceBirthday=daysSinceBirthday/30.44;return monthsSinceBirthday>=6?age+1:age;}
function setupBirthdayInput(){const yearInput=document.getElementById('birth-year'),monthInput=document.getElementById('birth-month'),dayInput=document.getElementById('birth-day'),currentYear=new Date().getFullYear();function updateInsuranceAgeDisplay(){const year=yearInput.value.trim(),month=monthInput.value.trim(),day=dayInput.value.trim(),ageDisplay=document.getElementById('insurance-age-display'),ageValue=document.getElementById('insurance-age-value'),insuranceAge=calculateInsuranceAgeValue(year,month,day);if(insuranceAge!==null){ageValue.textContent=insuranceAge+'세';ageDisplay.style.display='block';}else{ageDisplay.style.display='none';}}yearInput.addEventListener('input',(e)=>{e.target.value=e.target.value.replace(/\D/g,'');updateInsuranceAgeDisplay();if(e.target.value.length===4&&parseInt(e.target.value)<=currentYear)monthInput.focus();});monthInput.addEventListener('input',(e)=>{e.target.value=e.target.value.replace(/\D/g,'');if(e.target.value.length>=2){if(parseInt(e.target.value)>12)e.target.value='12';if(e.target.value.length===2)dayInput.focus();}updateInsuranceAgeDisplay();});dayInput.addEventListener('input',(e)=>{e.target.value=e.target.value.replace(/\D/g,'');if(e.target.value.length>=2&&parseInt(e.target.value)>31)e.target.value='31';updateInsuranceAgeDisplay();});}
function setupMedicalHistoryRadio(){const radios=document.querySelectorAll('input[name="medical-history"]'),detailSection=document.getElementById('medical-detail-section');radios.forEach(radio=>{radio.addEventListener('change',(e)=>{if(e.target.value==='있음')detailSection.classList.remove('hidden');else detailSection.classList.add('hidden');});});}
function toggleBirthMode(mode){birthInputMode=mode;document.getElementById('birth-mode-btn').classList.toggle('active',mode==='birth');document.getElementById('age-mode-btn').classList.toggle('active',mode==='age');document.getElementById('birth-input-container').style.display=mode==='birth'?'block':'none';document.getElementById('age-input-container').style.display=mode==='age'?'block':'none';if(mode==='age'){const d=document.getElementById('insurance-age-display');if(d)d.style.display='none';}}

// ============================================
// 모달 & 드래그
// ============================================
function initDraggable(){const modal=document.getElementById('seolmaetalk-modal-container'),header=document.getElementById('draggable-header');if(!modal||!header)return;let isDragging=false,startX=0,startY=0,modalX=0,modalY=0;header.addEventListener('mousedown',(e)=>{if(e.target.tagName==='BUTTON'||e.target.closest('button'))return;if(e.target.tagName==='IMG'||e.target.closest('img'))return;isDragging=true;startX=e.clientX;startY=e.clientY;const rect=modal.getBoundingClientRect();modalX=rect.left;modalY=rect.top;e.preventDefault();document.body.style.userSelect='none';});document.addEventListener('mousemove',(e)=>{if(!isDragging)return;const deltaX=e.clientX-startX,deltaY=e.clientY-startY;let newX=modalX+deltaX,newY=modalY+deltaY;const maxX=window.innerWidth-modal.offsetWidth,maxY=window.innerHeight-modal.offsetHeight;newX=Math.max(0,Math.min(newX,maxX));newY=Math.max(0,Math.min(newY,maxY));modal.style.left=newX+'px';modal.style.top=newY+'px';modal.style.transform='none';});document.addEventListener('mouseup',()=>{if(isDragging){isDragging=false;document.body.style.userSelect='';}});header.addEventListener('touchstart',(e)=>{if(e.target.tagName==='BUTTON'||e.target.closest('button'))return;if(e.target.tagName==='IMG'||e.target.closest('img'))return;isDragging=true;const touch=e.touches[0];startX=touch.clientX;startY=touch.clientY;const rect=modal.getBoundingClientRect();modalX=rect.left;modalY=rect.top;},{passive:true});document.addEventListener('touchmove',(e)=>{if(!isDragging)return;const touch=e.touches[0],deltaX=touch.clientX-startX,deltaY=touch.clientY-startY;let newX=modalX+deltaX,newY=modalY+deltaY;const maxX=window.innerWidth-modal.offsetWidth,maxY=window.innerHeight-modal.offsetHeight;newX=Math.max(0,Math.min(newX,maxX));newY=Math.max(0,Math.min(newY,maxY));modal.style.left=newX+'px';modal.style.top=newY+'px';modal.style.transform='none';},{passive:true});document.addEventListener('touchend',()=>{if(isDragging)isDragging=false;});}
function openSeolmaetalkModal(){const overlay=document.getElementById('seolmaetalk-modal-overlay'),modal=document.getElementById('seolmaetalk-modal-container');overlay.classList.add('active');document.body.style.overflow='hidden';setTimeout(()=>{const modalWidth=modal.offsetWidth,modalHeight=modal.offsetHeight,centerX=(window.innerWidth-modalWidth)/2,centerY=Math.max(10,(window.innerHeight-modalHeight)/2);modal.style.left=centerX+'px';modal.style.top=centerY+'px';modal.style.transform='none';},0);}
function closeSeolmaetalkModal(){document.getElementById('seolmaetalk-modal-overlay').classList.remove('active');document.body.style.overflow='';}
document.getElementById('seolmaetalk-modal-overlay')?.addEventListener('click',function(e){if(e.target.id==='seolmaetalk-modal-overlay')closeSeolmaetalkModal();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){const overlay=document.getElementById('seolmaetalk-modal-overlay');if(overlay?.classList.contains('active'))closeSeolmaetalkModal();}});
function openSeolmaetalkCompletionModal(modalId){document.getElementById(modalId).classList.add('active');}
function closeSeolmaetalkCompletionModal(modalId){document.getElementById(modalId).classList.remove('active');}
document.addEventListener('click',(e)=>{if(e.target.classList.contains('seolmaetalk-completion-modal')){if(e.target.id==='other-insurers-modal')closeOtherInsurersModal();else e.target.classList.remove('active');}});

// ============================================
// 스텝 관리
// ============================================
function switchInsuranceType(type){currentInsuranceType=type;document.querySelectorAll('#step-3 .mode-btn').forEach(btn=>btn.classList.remove('active'));event.target.classList.add('active');renderInsurerSelection();updateShareButtons();}
function nextStep(stepNum){if(!validateCurrentStep())return;if(stepNum===3){collectFormData();generateTexts();renderPreview();currentInsuranceType='nonlife';renderInsurerSelection();appState.sharedInsurers=[];}goToStep(stepNum);}
function prevStep(stepNum){goToStep(stepNum);}
function goToStep(stepNum){appState.currentStep=stepNum;document.querySelectorAll('.step').forEach((step,idx)=>{const num=idx+1;step.classList.remove('active','completed');if(num<stepNum)step.classList.add('completed');else if(num===stepNum)step.classList.add('active');});document.querySelectorAll('.step-content').forEach(content=>content.classList.add('hidden'));document.getElementById(`step-${stepNum}`).classList.remove('hidden');updateTopMenuBar('form');setTimeout(function(){var modal=document.getElementById('seolmaetalk-modal-container');if(!modal)return;var kids=modal.children;for(var i=0;i<kids.length;i++){kids[i].scrollTop=0;}var allEls=modal.querySelectorAll('*');for(var j=0;j<allEls.length;j++){var el=allEls[j];var style=window.getComputedStyle(el);if(style.overflow==='auto'||style.overflow==='scroll'||style.overflowY==='auto'||style.overflowY==='scroll'){el.scrollTop=0;}}},0);setTimeout(function(){var modal=document.getElementById('seolmaetalk-modal-container');if(!modal)return;var allEls=modal.querySelectorAll('*');for(var j=0;j<allEls.length;j++){var el=allEls[j];if(el.scrollTop>0)el.scrollTop=0;}},150);}
function validateCurrentStep(){const step=appState.currentStep;if(step===1){if(!document.getElementById('client-name').value.trim()){showToast('이름을 입력해주세요','error');return false;}if(!document.getElementById('gender-male').checked&&!document.getElementById('gender-female').checked){showToast('성별을 선택해주세요','error');return false;}if(birthInputMode==='birth'){if(!document.getElementById('birth-year').value.trim()||!document.getElementById('birth-month').value.trim()||!document.getElementById('birth-day').value.trim()){showToast('생년월일을 모두 입력해주세요','error');return false;}}else{if(!document.getElementById('age-range-select').value){showToast('연령대를 선택해주세요','error');return false;}}if(!document.querySelector('input[name="medical-history"]:checked')){showToast('병력 유무를 선택해주세요','error');return false;}}if(step===2){if(appState.selectedProducts.length===0){showToast('보험 종류를 선택해주세요','error');return false;}const min=document.getElementById('premium-min').value,max=document.getElementById('premium-max').value;if(!min||!max){showToast('월 납입료를 입력해주세요','error');return false;}if(parseInt(min)>parseInt(max)){showToast('최소 금액이 최대 금액보다 클 수 없습니다','error');return false;}}return true;}
function collectFormData(){let clientGender=document.getElementById('gender-male')?.checked?'남성':(document.getElementById('gender-female')?.checked?'여성':'');let clientBirth='',insuranceAge=null;if(birthInputMode==='birth'){const y=document.getElementById('birth-year').value.trim(),m=document.getElementById('birth-month').value.trim(),d=document.getElementById('birth-day').value.trim();if(y&&m&&d){clientBirth=`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;insuranceAge=calculateInsuranceAgeValue(y,m,d);}}else{const sel=document.getElementById('age-range-select');if(sel.value)clientBirth=sel.value;}const med=document.querySelector('input[name="medical-history"]:checked');let medicalInfo='';if(med?.value==='있음'){const diag=document.getElementById('medical-diagnosis').value.trim();medicalInfo='병력: 있음';if(diag)medicalInfo+=` / 진단: ${diag}`;}else{medicalInfo='병력: 없음';}appState.formData={clientName:document.getElementById('client-name').value.trim(),clientGender,clientBirth,insuranceAge,medicalInfo,clientAdditionalInfo:document.getElementById('client-additional-info').value.trim(),products:[...appState.selectedProducts],premiumMin:parseInt(document.getElementById('premium-min').value)||0,premiumMax:parseInt(document.getElementById('premium-max').value)||0,screeningType:document.getElementById('screening-type').value,paymentPeriod:document.getElementById('payment-period').value,coveragePeriod:document.getElementById('coverage-period').value,refundType:document.getElementById('refund-type').value};}
function generateTexts(){const d=appState.formData;let pt=d.products.length<=3?d.products.join(', '):d.products.slice(0,3).join(', ')+` (+외 ${d.products.length-3})`;let kt=`• 고객: ${d.clientName}\n• 담보: ${pt}\n• 예산: ${d.premiumMin}~${d.premiumMax}만원\n`;if(d.insuranceAge!==null)kt+=`• 보험상령나이: ${d.insuranceAge}세\n`;if(d.medicalInfo)kt+=`• ${d.medicalInfo}\n`;if(d.screeningType)kt+=`• 심사: ${d.screeningType}\n`;if(d.paymentPeriod||d.coveragePeriod)kt+=`• 기간: ${d.paymentPeriod||'-'} / ${d.coveragePeriod||'-'}\n`;if(d.refundType)kt+=`• 환급: ${d.refundType}\n`;if(d.clientAdditionalInfo)kt+=`• 추가정보: ${d.clientAdditionalInfo}\n`;let st=`고객 ${d.clientName} / ${pt.replace(/, /g,'·')} / ${d.premiumMin}~${d.premiumMax}만원`;if(d.insuranceAge!==null)st+=` / ${d.insuranceAge}세`;if(d.screeningType)st+=` / ${d.screeningType}`;if(d.paymentPeriod&&d.coveragePeriod)st+=` / ${d.paymentPeriod}·${d.coveragePeriod}`;if(d.refundType)st+=` / ${d.refundType}`;st+='.';appState.generatedTexts={kakao:kt,sms:st};}
function renderPreview(){const d=appState.formData;let h=`<div class="preview-row"><div class="preview-label">고객</div><div class="preview-value">${d.clientName}</div></div>`;h+=`<div class="preview-row"><div class="preview-label">성별</div><div class="preview-value">${d.clientGender}</div></div>`;if(d.insuranceAge!==null)h+=`<div class="preview-row"><div class="preview-label">보험상령나이</div><div class="preview-value">${d.insuranceAge}세</div></div>`;h+=`<div class="preview-row"><div class="preview-label">담보</div><div class="preview-value">${d.products.join(', ')}</div></div>`;h+=`<div class="preview-row"><div class="preview-label">예산</div><div class="preview-value">${d.premiumMin}~${d.premiumMax}만원</div></div>`;if(d.medicalInfo)h+=`<div class="preview-row"><div class="preview-label">병력</div><div class="preview-value">${d.medicalInfo}</div></div>`;if(d.screeningType)h+=`<div class="preview-row"><div class="preview-label">심사</div><div class="preview-value">${d.screeningType}</div></div>`;if(d.paymentPeriod||d.coveragePeriod)h+=`<div class="preview-row"><div class="preview-label">기간</div><div class="preview-value">${d.paymentPeriod||'-'} / ${d.coveragePeriod||'-'}</div></div>`;if(d.refundType)h+=`<div class="preview-row"><div class="preview-label">환급</div><div class="preview-value">${d.refundType}</div></div>`;if(d.clientAdditionalInfo)h+=`<div class="preview-row"><div class="preview-label">추가정보</div><div class="preview-value">${d.clientAdditionalInfo}</div></div>`;document.getElementById('preview-card').innerHTML=h;}

// ============================================
// 보험사 선택 & 공유
// ============================================
function renderInsurerSelection(){const container=document.getElementById('final-insurer-chips'),list=currentInsuranceType==='life'?LIFE_INSURERS:INSURERS,logos=currentInsuranceType==='life'?LIFE_INSURER_LOGOS:INSURER_LOGOS,selected=currentInsuranceType==='life'?appState.selectedLifeInsurers:appState.selectedNonlifeInsurers;let h='';list.forEach(ins=>{const logo=logos[ins]||'';const sel=selected.includes(ins)?'selected':'';h+=`<div class="insurer-logo-item ${sel}" data-insurer="${ins}"><img src="${logo}" alt="${ins}" class="insurer-logo-img"></div>`;});container.innerHTML=h;document.querySelectorAll('.insurer-logo-item').forEach(item=>item.addEventListener('click',()=>{item.classList.toggle('selected');updateShareButtons();}));}
function updateShareButtons(){const items=document.querySelectorAll('.insurer-logo-item.selected');if(currentInsuranceType==='life')appState.selectedLifeInsurers=Array.from(items).map(i=>i.dataset.insurer);else appState.selectedNonlifeInsurers=Array.from(items).map(i=>i.dataset.insurer);appState.selectedInsurers=[...appState.selectedNonlifeInsurers,...appState.selectedLifeInsurers];const container=document.getElementById('share-buttons-container');if(appState.selectedInsurers.length===0){container.innerHTML='<p style="text-align:center;color:var(--muted);padding:20px;">전달할 보험사를 선택해주세요</p>';return;}let h='';appState.selectedInsurers.forEach(ins=>{const shared=appState.sharedInsurers.includes(ins);h+=`<button class="share-btn-insurer" onclick="shareToInsurer('${ins}')" ${shared?'disabled':''}><i class="ii ii-kakaotalk" style="margin-right:8px;"></i> ${shared?`${ins} 매니저에게 전달완료`:`${ins} 매니저에게 전달`}</button>`;});container.innerHTML=h;}
async function shareToInsurer(insurerName){if(!appState.selectedInsurers.includes(insurerName)){showToast('선택되지 않은 보험사입니다','error');return;}if(appState.sharedInsurers.includes(insurerName)){showToast('이미 공유된 보험사입니다','info');return;}if(typeof Kakao==='undefined'||!Kakao.isInitialized()){showToast('카카오톡 SDK를 초기화할 수 없습니다','error');return;}const d=appState.formData,code=insurerCommissionCodes[insurerName]||'입력안함';let pt=d.products.length<=3?d.products.join(', '):d.products.slice(0,3).join(', ')+` (+외 ${d.products.length-3})`;let t=`[${insurerName} 설계의뢰입니다]\n\n• 고객: ${d.clientName}\n• 성별: ${d.clientGender}\n• 생년월일/연령대: ${d.clientBirth}\n`;if(d.insuranceAge!==null)t+=`• 보험상령나이: ${d.insuranceAge}세\n`;t+=`• 담보: ${pt}\n• 예산: ${d.premiumMin}~${d.premiumMax}만원\n`;if(d.medicalInfo)t+=`• ${d.medicalInfo}\n`;if(d.screeningType)t+=`• 심사: ${d.screeningType}\n`;if(d.paymentPeriod||d.coveragePeriod)t+=`• 기간: ${d.paymentPeriod||'-'} / ${d.coveragePeriod||'-'}\n`;if(d.refundType)t+=`• 환급: ${d.refundType}\n`;if(d.clientAdditionalInfo)t+=`• 추가정보: ${d.clientAdditionalInfo}\n`;t+=`\n• 설계사 위촉코드: ${code}`;try{Kakao.Link.sendDefault({objectType:'text',text:t,link:{mobileWebUrl:'https://gaworld.kr/infra',webUrl:'https://gaworld.kr/infra'},buttonTitle:'모두의전산'});await saveRequest(insurerName);appState.sharedInsurers.push(insurerName);updateShareButtons();if(appState.sharedInsurers.length===appState.selectedInsurers.length)setTimeout(()=>showCompletionModalWithCount(appState.selectedInsurers.length),1000);}catch(err){console.error('공유 실패:',err);showToast('공유 실패','error');}}
async function saveRequest(insurerName){if(!supabase||!currentPlannerId){showToast('Supabase 연결 오류','error');return;}try{const rd={planner_id:currentPlannerId,client_name:appState.formData.clientName,client_masked:maskName(appState.formData.clientName),client_gender:appState.formData.clientGender,client_birth:appState.formData.clientBirth,medical_info:appState.formData.medicalInfo,products_text:appState.formData.products.join(', '),premium_min:appState.formData.premiumMin,premium_max:appState.formData.premiumMax,screening_type:appState.formData.screeningType||'',payment_period:appState.formData.paymentPeriod||'',coverage_period:appState.formData.coveragePeriod||'',refund_type:appState.formData.refundType||'',additional_info:appState.formData.clientAdditionalInfo||'',delivered_insurers:[insurerName],standard_text_kakao:appState.generatedTexts.kakao,standard_text_sms:appState.generatedTexts.sms};const{error}=await supabase.from('requests').insert([rd]).select();if(error){console.error('DB 저장 실패:',error);showToast(`DB 저장 실패: ${error.message}`,'error');}}catch(err){console.error('저장 오류:',err);showToast(`저장 오류: ${err.message}`,'error');}}
function maskName(name){if(!name||name.length<=2)return'**';return name.charAt(0)+'*'.repeat(name.length-1);}
function showCompletionModalWithCount(count){const el=document.getElementById('completion-count-text');if(el)el.textContent=`총 ${count}개 보험사에 설계의뢰를 전달했습니다`;openSeolmaetalkCompletionModal('seolmaetalk-completion-modal');}
function goToMypage(){closeSeolmaetalkCompletionModal('seolmaetalk-completion-modal');resetForm();previousTab='form';switchTab('mypage');}
function closeCompletionModal(){closeSeolmaetalkCompletionModal('seolmaetalk-completion-modal');resetForm();}
function resetForm(){document.getElementById('client-name').value='';document.getElementById('gender-male').checked=false;document.getElementById('gender-female').checked=false;document.getElementById('birth-year').value='';document.getElementById('birth-month').value='';document.getElementById('birth-day').value='';document.getElementById('age-range-select').value='';document.getElementById('client-additional-info').value='';document.getElementById('premium-min').value='';document.getElementById('premium-max').value='';document.getElementById('screening-type').value='';document.getElementById('payment-period').value='';document.getElementById('coverage-period').value='';document.getElementById('refund-type').value='';const ad=document.getElementById('insurance-age-display');if(ad)ad.style.display='none';document.querySelectorAll('input[name="medical-history"]').forEach(r=>r.checked=false);document.querySelectorAll('.chip.selected').forEach(c=>c.classList.remove('selected'));appState.selectedProducts=[];appState.selectedNonlifeInsurers=[];appState.selectedLifeInsurers=[];appState.selectedInsurers=[];appState.sharedInsurers=[];currentInsuranceType='nonlife';goToStep(1);}

// ============================================
// 마이페이지
// ============================================
async function loadRequests(){const container=document.getElementById('request-list');if(!supabase||!currentPlannerId){container.innerHTML='<p class="text-center" style="color:var(--muted);">로그인이 필요합니다</p>';return;}try{const{data}=await supabase.from('requests').select('*').eq('planner_id',currentPlannerId).order('created_at',{ascending:false}).limit(100);if(!data||data.length===0){container.innerHTML='<p class="text-center" style="color:var(--muted);">아직 설계의뢰 내역이 없습니다</p>';return;}allRequests=data;renderRequestList(data);}catch(err){container.innerHTML='<p class="text-center" style="color:var(--error);">불러오기에 실패했습니다</p>';}}
function applyFilters(){const kw=document.getElementById('unified-search-box').value.toLowerCase().trim(),sort=document.getElementById('sort-type').value;let filtered=allRequests.filter(r=>{if(!kw)return true;return(r.client_name||'').toLowerCase().includes(kw)||r.delivered_insurers?.some(i=>i.toLowerCase().includes(kw))||(r.medical_info||'').toLowerCase().includes(kw)||(r.products_text||'').toLowerCase().includes(kw);});if(sort==='latest')filtered.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));else if(sort==='oldest')filtered.sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));else if(sort==='name')filtered.sort((a,b)=>(a.client_name||'').localeCompare(b.client_name||''));renderRequestList(filtered);}
function renderRequestList(requests){const container=document.getElementById('request-list');if(!requests||requests.length===0){container.innerHTML='<p class="text-center" style="color:var(--muted);padding:20px;">검색 결과가 없습니다</p>';return;}let h='';requests.forEach(r=>{const date=new Date(r.created_at).toLocaleDateString('ko-KR'),prods=r.products_text?.split(',').slice(0,2).map(p=>p.trim()).join(' · ')||'상품미지정',hasMore=r.products_text?.split(',').length>2,budget=`${r.premium_min}~${r.premium_max}만원`,insurers=r.delivered_insurers||[];let logos='';insurers.slice(0,3).forEach(ins=>{const url=INSURER_LOGOS[ins]||LIFE_INSURER_LOGOS[ins]||'';if(url)logos+=`<div class="request-logo-box" title="${ins}"><img src="${url}" alt="${ins}"></div>`;});if(insurers.length>3)logos+=`<div class="request-logo-more">+${insurers.length-3}</div>`;h+=`<div class="request-item" data-request-id="${r.id}"><div class="request-left"><div class="request-date">${date}</div><div class="request-client-name">${r.client_name}</div><div class="request-meta"><div class="request-meta-item">${prods}${hasMore?' +':''}</div><div class="request-meta-item">${budget}</div></div></div><div class="request-logos">${logos}</div></div>`;});container.innerHTML=h;container.querySelectorAll('.request-item').forEach(item=>item.addEventListener('click',()=>showRequestDetail(item.dataset.requestId)));}
async function showRequestDetail(requestId){currentDetailId=requestId;if(!supabase)return;document.getElementById('header-back-btn').classList.remove('hidden-btn');previousTab='mypage';try{const{data}=await supabase.from('requests').select('*').eq('id',requestId).single();if(!data)return;currentDetailData=data;const date=new Date(data.created_at).toLocaleString('ko-KR');let h=`<h2 class="card-title" style="margin-bottom:24px;">의뢰 상세</h2><div class="detail-info-card"><div class="detail-info-row"><div class="detail-info-label">작성일시</div><div class="detail-info-value">${date}</div></div><div class="detail-info-row"><div class="detail-info-label">고객명</div><div class="detail-info-value">${data.client_name}</div></div>`;if(data.delivered_insurers?.length>0)h+=`<div class="detail-info-row"><div class="detail-info-label">전달 보험사</div><div class="detail-info-value">${data.delivered_insurers.join(', ')}</div></div>`;h+=`</div><div class="detail-text-card"><div class="detail-text-title">카카오톡용 텍스트</div><div class="detail-text-content">${data.standard_text_kakao}</div></div><div class="detail-share-buttons"><button class="detail-other-insurer-btn" onclick="showOtherInsurersModal()"><i class="fi fi-sr-share"></i> 타보험사로 공유</button></div>`;document.getElementById('detail-content-inline').innerHTML=h;document.getElementById('mypage-list-view').style.display='none';document.getElementById('mypage-detail-view').style.display='block';}catch(err){showToast('상세 정보를 불러올 수 없습니다','error');}}
function showRequestList(){document.getElementById('mypage-list-view').style.display='block';document.getElementById('mypage-detail-view').style.display='none';document.getElementById('header-back-btn').classList.add('hidden-btn');previousTab=null;}

// ============================================
// 위촉코드
// ============================================
async function loadCredentials(){renderNonlifeCredentialsForm();}
function switchCredentialMode(mode){currentCredentialMode=mode;document.querySelectorAll('.mode-btn').forEach(btn=>btn.classList.remove('active'));event.target.classList.add('active');document.getElementById('nonlife-credentials-section').style.display=mode==='손해보험'?'block':'none';document.getElementById('life-credentials-section').style.display=mode==='생명보험'?'block':'none';if(mode==='손해보험')renderNonlifeCredentialsForm();else renderLifeCredentialsForm();}
function renderNonlifeCredentialsForm(){let h='';INSURERS.forEach(ins=>{const logo=INSURER_LOGOS[ins]||'',code=insurerCommissionCodes[ins]||'';h+=`<div class="credentials-item"><div class="credentials-logo"><img src="${logo}" alt="${ins}"></div><div class="credentials-input-wrapper"><input type="text" class="credentials-code-input" data-insurer="${ins}" placeholder="위촉코드" value="${code}"></div></div>`;});document.getElementById('nonlife-insurers-container').innerHTML=h;}
function renderLifeCredentialsForm(){let h='';LIFE_INSURERS.forEach(ins=>{const logo=LIFE_INSURER_LOGOS[ins]||'',code=insurerCommissionCodes[ins]||'';h+=`<div class="credentials-item"><div class="credentials-logo"><img src="${logo}" alt="${ins}"></div><div class="credentials-input-wrapper"><input type="text" class="credentials-code-input" data-insurer="${ins}" placeholder="위촉코드" value="${code}"></div></div>`;});document.getElementById('life-insurers-container').innerHTML=h;}
async function saveAllCredentials(type){if(!supabase||!currentPlannerId){showToast('로그인이 필요합니다','error');return;}const inputs=document.querySelectorAll('.credentials-code-input'),creds=[];inputs.forEach(inp=>{const ins=inp.dataset.insurer,code=inp.value.trim();if(code)creds.push({planner_id:currentPlannerId,insurer_name:ins,commission_code:code,type:type==='life'?'생명보험':'손해보험'});});if(creds.length===0){showToast('최소 1개 이상의 위촉코드를 입력해주세요','error');return;}try{let updated=0;for(const c of creds){if(!insurerCommissionCodes[c.insurer_name]||insurerCommissionCodes[c.insurer_name]!==c.commission_code){const{error}=await supabase.from('insurer_credentials').upsert(c,{onConflict:'planner_id,insurer_name'});if(!error){insurerCommissionCodes[c.insurer_name]=c.commission_code;updated++;}}}if(updated>0)showToast(`✅ ${updated}개 위촉코드가 저장되었습니다!`,'success');else showToast('변경된 위촉코드가 없습니다','info');if(type==='life')renderLifeCredentialsForm();else renderNonlifeCredentialsForm();}catch(err){showToast('저장에 실패했습니다','error');}}

// ============================================
// 대시보드
// ============================================
function renderSummaryCards(data){const total=data.length,daysInMonth=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate(),avg=(total/daysInMonth).toFixed(1);document.getElementById('summary-cards').innerHTML=`<div style="background:white;border:1px solid #E5E0D8;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.05);"><div style="font-size:13px;color:#999;font-weight:600;margin-bottom:4px;">이달 총 의뢰</div><div style="display:flex;align-items:baseline;gap:8px;"><div class="counter-total" data-target="${total}" style="font-size:60px;font-weight:800;color:#191919;line-height:1;">0</div><div style="font-size:13px;color:#999;">건의 설계의뢰</div></div></div><div style="background:white;border:1px solid #E5E0D8;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.05);"><div style="font-size:13px;color:#999;font-weight:600;margin-bottom:4px;">1일 평균</div><div style="display:flex;align-items:baseline;gap:8px;"><div class="counter-average" data-target="${avg}" style="font-size:60px;font-weight:800;color:#058240;line-height:1;">0</div><div style="font-size:13px;color:#999;">1일 평균 의뢰</div></div></div>`;setTimeout(()=>{animateCounter('.counter-total',true);animateCounter('.counter-average',false);},100);}
function animateCounter(sel,isInt){const el=document.querySelector(sel);if(!el)return;const target=parseFloat(el.dataset.target);let current=0;const inc=target/(1500/16);const timer=setInterval(()=>{current+=inc;if(current>=target){el.textContent=isInt?target:target.toFixed(1);clearInterval(timer);}else{el.textContent=isInt?Math.floor(current):current.toFixed(1);}},16);}
function renderStackedBarChart(targetId,title,stats){const sorted=Object.entries(stats).sort((a,b)=>b[1]-a[1]),top5=sorted.slice(0,5),others=sorted.slice(5),othersSum=others.reduce((s,[,c])=>s+c,0),displayData=[...top5];if(othersSum>0)displayData.push(['기타',othersSum]);const total=Object.values(stats).reduce((a,b)=>a+b,0)||1,colors=['#f7cc3d','#ffe3a2','#aecacc','#87c25a','#058240','#a19d92'];let barHtml='',legendHtml='';displayData.forEach(([name,count],i)=>{const pct=((count/total)*100).toFixed(1);barHtml+=`<div class="stacked-segment" style="width:${pct}%;background:${colors[i]};" title="${name}: ${pct}%"></div>`;legendHtml+=`<div class="stacked-legend-item"><div class="stacked-legend-rank" style="background:${colors[i]};">${i<5?i+1:'∙'}</div><span class="stacked-legend-name">${name}</span><span class="stacked-legend-value">${pct}%</span><span class="stacked-legend-count">${count}건</span></div>`;});document.getElementById(targetId).innerHTML=`<div style="background:white;border-radius:16px;border:1px solid #E5E0D8;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.05);"><div style="padding:20px 24px;background:#F9F9F4;border-bottom:1px solid #E5E0D8;"><h3 style="font-weight:700;font-size:15px;color:#191919;margin:0;"><span class="section-indicator"></span>${title}</h3></div><div style="padding:24px;"><div class="stacked-bar-wrapper"><div class="stacked-bar">${barHtml}</div></div><div class="stacked-legend">${legendHtml}</div></div></div>`;}
function renderRankingTable(stats){renderStackedBarChart('ranking-table-card','MY TOP 5 보험사',stats);}
function renderProductsRanking(stats){renderStackedBarChart('products-ranking-card','담보(상품군)별 의뢰 비중',stats);}
function renderMonthComparison(cur,prev){const cc=cur?.length||0,pc=prev?.length||0,change=cc-pc,pct=pc>0?((Math.abs(change)/pc)*100).toFixed(1):0,up=change>=0,color=up?'#058240':'#E74C3C',icon=up?'▲':'▼',bg=up?'#E8F5E9':'#FDEDEC';document.getElementById('month-comparison-card').innerHTML=`<div style="background:white;border-radius:16px;padding:24px;border:1px solid #E5E0D8;box-shadow:0 1px 3px rgba(0,0,0,0.06);"><h3 style="font-weight:700;margin-bottom:20px;font-size:15px;color:#191919;"><span class="section-indicator"></span>전월 비교분석</h3><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;"><div style="text-align:center;padding:20px;background:#FFFBE6;border-radius:12px;border:1px solid #FEE500;"><div style="font-size:12px;color:#058240;font-weight:600;margin-bottom:8px;">이번달</div><div style="font-size:32px;font-weight:800;color:#191919;line-height:1;">${cc}</div><div style="font-size:12px;color:#999;margin-top:6px;">건</div></div><div style="text-align:center;padding:20px;background:#F5F3ED;border-radius:12px;border:1px solid #E5E0D8;"><div style="font-size:12px;color:#999;font-weight:600;margin-bottom:8px;">지난달</div><div style="font-size:32px;font-weight:800;color:#999;line-height:1;">${pc}</div><div style="font-size:12px;color:#bbb;margin-top:6px;">건</div></div><div style="text-align:center;padding:20px;background:${bg};border-radius:12px;border:1px solid ${color}20;"><div style="font-size:12px;color:${color};font-weight:600;margin-bottom:8px;">${up?'증가':'감소'}</div><div style="font-size:32px;font-weight:800;color:${color};line-height:1;">${icon} ${Math.abs(change)}</div><div style="font-size:12px;color:${color};margin-top:6px;">전월대비 ${pct}%</div></div></div></div>`;}
function renderLast7DaysChart(stats){const today=new Date(),dates=[];for(let i=6;i>=0;i--)dates.push(new Date(today.getTime()-i*864e5).toISOString().split('T')[0]);const data=dates.map(d=>({date:d.split('-')[2],count:stats[d]||0})),maxC=Math.max(...data.map(d=>d.count),1),cH=140,cW=500,pL=40,pR=40,vW=cW+pL+pR,sp=cW/6;let pts=[],circles='',bars='';data.forEach((item,i)=>{const x=pL+i*sp,y=cH-(item.count/maxC)*cH,bH=(item.count/maxC)*cH;bars+=`<rect x="${x-16}" y="${cH-bH}" width="32" height="${bH}" fill="#87c25a" opacity="0.7" rx="4" style="animation:barGrow 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards;opacity:0;animation-delay:${0.1+i*0.06}s;--bar-height:${bH}px;"/>`;pts.push({x,y});circles+=`<circle cx="${x}" cy="${y}" r="5" fill="white" stroke="#058240" stroke-width="2" style="animation:pointPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;opacity:0;animation-delay:${1.1+i*0.05}s;"/>`;});let pathLen=0;for(let i=0;i<pts.length-1;i++){const dx=pts[i+1].x-pts[i].x,dy=pts[i+1].y-pts[i].y;pathLen+=Math.sqrt(dx*dx+dy*dy);}const pathD=pts.map(p=>`${p.x},${p.y}`).join(' ');const dateTexts=data.map((item,i)=>`<text x="${pL+i*sp}" y="180" text-anchor="middle" font-size="13" fill="#999" font-weight="600" style="animation:textFadeIn 0.5s ease-out 1.4s forwards;opacity:0;">${item.date}</text>`).join('');document.getElementById('last-7days-chart').innerHTML=`<svg width="100%" height="220" viewBox="0 0 ${vW} 220" preserveAspectRatio="xMidYMid meet" style="display:block;margin:0 auto;"><defs><style>@keyframes barGrow{from{height:0;opacity:0}to{height:var(--bar-height);opacity:1}}@keyframes pointPop{0%{r:0;opacity:0}60%{r:7px}100%{r:5px;opacity:1}}@keyframes textFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}</style></defs><line x1="${pL}" y1="${cH}" x2="${pL+cW}" y2="${cH}" stroke="#E5E0D8" stroke-width="1"/>${bars}<polyline points="${pathD}" fill="none" stroke="#058240" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:${pathLen};stroke-dashoffset:${pathLen};animation:lineDrawing 1s ease-out 0.6s forwards;opacity:0;"/>${circles}${dateTexts}</svg><style>@keyframes lineDrawing{from{stroke-dashoffset:${pathLen};opacity:0}to{stroke-dashoffset:0;opacity:1}}</style>`;}
function renderCustomerAnalysis(ageStats,genderStats,medicalStats){const sortedAges=Object.entries(ageStats).sort((a,b)=>b[1]-a[1]).slice(0,3),totalAge=Object.values(ageStats).reduce((a,b)=>a+b,0)||1,ageColors=['#058240','#87c25a','#aecacc'];let ageH='';sortedAges.forEach(([age,count],i)=>{const p=((count/totalAge)*100).toFixed(0);ageH+=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:5px;"><span style="font-size:13px;font-weight:600;color:#191919;white-space:nowrap;">${age}</span><div style="flex:1;height:6px;background:#E5E0D8;border-radius:3px;min-width:60px;"><div style="height:100%;background:${ageColors[i]};width:${p}%;border-radius:3px;"></div></div><span style="font-size:14px;font-weight:700;color:#058240;min-width:30px;text-align:right;">${p}%</span></div>`;});const totalG=Object.values(genderStats).reduce((a,b)=>a+b,0)||1;let gH='';Object.entries(genderStats).forEach(([g,c])=>{const p=((c/totalG)*100).toFixed(0),col=g==='남성'?'#058240':'#E74C3C';gH+=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:5px;"><span style="font-size:13px;font-weight:600;color:#191919;white-space:nowrap;">${g}</span><div style="flex:1;height:6px;background:#E5E0D8;border-radius:3px;min-width:60px;"><div style="height:100%;background:${col};width:${p}%;border-radius:3px;"></div></div><span style="font-size:14px;font-weight:700;color:${col};min-width:30px;text-align:right;">${p}%</span></div>`;});const totalM=Object.values(medicalStats).reduce((a,b)=>a+b,0)||1;let mH='';Object.entries(medicalStats).forEach(([m,c])=>{const p=((c/totalM)*100).toFixed(0),col=m==='없음'?'#87c25a':'#f7cc3d';mH+=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:5px;"><span style="font-size:13px;font-weight:600;color:#191919;white-space:nowrap;">${m==='없음'?'없음':'있음'}</span><div style="flex:1;height:6px;background:#E5E0D8;border-radius:3px;min-width:60px;"><div style="height:100%;background:${col};width:${p}%;border-radius:3px;"></div></div><span style="font-size:14px;font-weight:700;color:${col};min-width:30px;text-align:right;">${p}%</span></div>`;});const ageEl=document.getElementById('age-analysis-content'),gEl=document.getElementById('gender-analysis-content'),mEl=document.getElementById('medical-analysis-content');if(ageEl)ageEl.innerHTML=ageH;if(gEl)gEl.innerHTML=gH;if(mEl)mEl.innerHTML=mH;}
function selectDatePreset(preset){currentDateRange={preset,startDate:null,endDate:null};document.querySelectorAll('.period-preset-btn').forEach(btn=>{btn.classList.remove('active');if(btn.dataset.preset===preset)btn.classList.add('active');});const custom=document.getElementById('custom-date-range');if(preset==='custom')custom.style.display='flex';else{custom.style.display='none';loadDashboardData();}}
function applyCustomDateRange(){const s=document.getElementById('range-start-date').value,e=document.getElementById('range-end-date').value;if(!s||!e){showToast('시작일과 종료일을 모두 선택해주세요','error');return;}if(new Date(s)>new Date(e)){showToast('시작일이 종료일보다 클 수 없습니다','error');return;}currentDateRange={preset:'custom',startDate:s,endDate:e};loadDashboardData();}
function getDateRange(){const today=new Date();let startDate,endDate;if(currentDateRange.preset==='custom'){startDate=currentDateRange.startDate;endDate=currentDateRange.endDate;}else if(currentDateRange.preset==='7days'){startDate=new Date(today.getTime()-7*864e5).toISOString().split('T')[0];endDate=today.toISOString().split('T')[0];}else if(currentDateRange.preset==='30days'){startDate=new Date(today.getTime()-30*864e5).toISOString().split('T')[0];endDate=today.toISOString().split('T')[0];}else if(currentDateRange.preset==='90days'){startDate=new Date(today.getTime()-90*864e5).toISOString().split('T')[0];endDate=today.toISOString().split('T')[0];}return{startDate,endDate};}
async function loadDashboardData(){if(!supabase||!currentPlannerId){showToast('로그인이 필요합니다','error');return;}const{startDate,endDate}=getDateRange();try{const{data:rangeData}=await supabase.from('requests').select('*').eq('planner_id',currentPlannerId).gte('created_at',`${startDate}T00:00:00`).lte('created_at',`${endDate}T23:59:59`);const sevenAgo=new Date(new Date().getTime()-7*864e5).toISOString().split('T')[0],todayStr=new Date().toISOString().split('T')[0];const{data:last7Data}=await supabase.from('requests').select('*').eq('planner_id',currentPlannerId).gte('created_at',`${sevenAgo}T00:00:00`).lte('created_at',`${todayStr}T23:59:59`);const now=new Date(),thisMS=new Date(now.getFullYear(),now.getMonth(),1).toISOString().split('T')[0],thisME=now.toISOString().split('T')[0],prevMS=new Date(now.getFullYear(),now.getMonth()-1,1).toISOString().split('T')[0],prevME=new Date(now.getFullYear(),now.getMonth(),0).toISOString().split('T')[0];const{data:curMonth}=await supabase.from('requests').select('*').eq('planner_id',currentPlannerId).gte('created_at',`${thisMS}T00:00:00`).lte('created_at',`${thisME}T23:59:59`);const{data:prevMonth}=await supabase.from('requests').select('*').eq('planner_id',currentPlannerId).gte('created_at',`${prevMS}T00:00:00`).lte('created_at',`${prevME}T23:59:59`);if(!rangeData){showToast('데이터를 불러올 수 없습니다','error');return;}const insurerStats={},ageStats={},genderStats={},medicalStats={'없음':0,'있음':0},productsStats={};rangeData.forEach(r=>{r.delivered_insurers?.forEach(ins=>insurerStats[ins]=(insurerStats[ins]||0)+1);r.products_text?.split(',').map(p=>p.trim()).forEach(p=>{if(p)productsStats[p]=(productsStats[p]||0)+1;});if(r.client_birth){let ag=r.client_birth;const dm=r.client_birth?.match(/^(\d{4})-(\d{2})-(\d{2})$/);if(dm){const ia=calculateInsuranceAgeValue(dm[1],dm[2],dm[3]);if(ia!==null){if(ia<10)ag='10세 미만 아동';else if(ia<20)ag='10대';else if(ia<30)ag='20대';else if(ia<40)ag='30대';else if(ia<50)ag='40대';else if(ia<60)ag='50대';else if(ia<70)ag='60대';else if(ia<80)ag='70대';else ag='80세 이상';}}ageStats[ag]=(ageStats[ag]||0)+1;}if(r.client_gender)genderStats[r.client_gender]=(genderStats[r.client_gender]||0)+1;if(r.medical_info?.includes('있음'))medicalStats['있음']++;else if(r.medical_info)medicalStats['없음']++;});const last7Stats={};last7Data?.forEach(r=>{const d=new Date(r.created_at).toISOString().split('T')[0];last7Stats[d]=(last7Stats[d]||0)+1;});renderSummaryCards(rangeData);renderRankingTable(insurerStats);renderProductsRanking(productsStats);renderLast7DaysChart(last7Stats);renderMonthComparison(curMonth||[],prevMonth||[]);renderCustomerAnalysis(ageStats,genderStats,medicalStats);}catch(err){console.error('❌ 대시보드 데이터 로드 실패:',err);showToast('데이터 로드 실패','error');}}

// ============================================
// 타보험사 공유
// ============================================
function showOtherInsurersModal(){if(!currentDetailData){showToast('의뢰 정보를 불러올 수 없습니다','error');return;}const delivered=currentDetailData.delivered_insurers||[],availNL=INSURERS.filter(i=>!delivered.includes(i)),availL=LIFE_INSURERS.filter(i=>!delivered.includes(i));if(availNL.length===0&&availL.length===0){showToast('모든 보험사에 이미 전달되었습니다','info');return;}selectedOtherInsurers=[];currentOtherInsuranceType='nonlife';renderOtherInsurersGrid('nonlife',availNL);renderOtherInsurersGrid('life',availL);const nlTab=document.getElementById('other-nonlife-tab'),lTab=document.getElementById('other-life-tab');nlTab.classList.add('active');nlTab.style.color='#191919';nlTab.style.borderBottom='3px solid #FEE500';lTab.classList.remove('active');lTab.style.color='#999999';lTab.style.borderBottom='none';document.getElementById('other-nonlife-insurers-grid').style.display='grid';document.getElementById('other-life-insurers-grid').style.display='none';updateOtherShareButtons();openSeolmaetalkCompletionModal('other-insurers-modal');}
function renderOtherInsurersGrid(type,insurers){const gridId=type==='life'?'other-life-insurers-grid':'other-nonlife-insurers-grid',logos=type==='life'?LIFE_INSURER_LOGOS:INSURER_LOGOS,grid=document.getElementById(gridId);let h='';insurers.forEach(ins=>{const logo=logos[ins]||'';h+=`<div class="other-insurer-item" data-insurer="${ins}" data-type="${type}"><img src="${logo}" alt="${ins}"></div>`;});if(insurers.length===0)h='<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:40px;">전달 가능한 보험사가 없습니다</p>';grid.innerHTML=h;grid.querySelectorAll('.other-insurer-item').forEach(item=>item.addEventListener('click',()=>toggleOtherInsurer(item.dataset.insurer)));}
function switchOtherInsuranceType(type){currentOtherInsuranceType=type;const nlTab=document.getElementById('other-nonlife-tab'),lTab=document.getElementById('other-life-tab');if(type==='nonlife'){nlTab.classList.add('active');nlTab.style.color='#191919';nlTab.style.borderBottom='3px solid #FEE500';lTab.classList.remove('active');lTab.style.color='#999999';lTab.style.borderBottom='none';document.getElementById('other-nonlife-insurers-grid').style.display='grid';document.getElementById('other-life-insurers-grid').style.display='none';}else{lTab.classList.add('active');lTab.style.color='#191919';lTab.style.borderBottom='3px solid #FEE500';nlTab.classList.remove('active');nlTab.style.color='#999999';nlTab.style.borderBottom='none';document.getElementById('other-life-insurers-grid').style.display='grid';document.getElementById('other-nonlife-insurers-grid').style.display='none';}}
function closeOtherInsurersModal(){selectedOtherInsurers=[];closeSeolmaetalkCompletionModal('other-insurers-modal');}
function toggleOtherInsurer(insurerName){document.querySelectorAll('.other-insurer-item').forEach(item=>{if(item.dataset.insurer===insurerName){item.classList.toggle('selected');if(item.classList.contains('selected')){if(!selectedOtherInsurers.includes(insurerName))selectedOtherInsurers.push(insurerName);}else{selectedOtherInsurers=selectedOtherInsurers.filter(i=>i!==insurerName);}}});updateOtherShareButtons();}
function updateOtherShareButtons(){const container=document.getElementById('other-share-buttons-container');if(selectedOtherInsurers.length===0){container.innerHTML='<p style="text-align:center;color:var(--muted);padding:20px;">공유할 보험사를 선택해주세요</p>';return;}let h='';selectedOtherInsurers.forEach(ins=>{h+=`<button class="share-btn-insurer" onclick="shareToOneOtherInsurer('${ins}')"><i class="ii ii-kakaotalk" style="margin-right:8px;"></i> ${ins} 매니저에게 전달</button>`;});container.innerHTML=h;}
async function shareToOneOtherInsurer(insurerName){if(!currentDetailData){showToast('의뢰 정보를 불러올 수 없습니다','error');return;}if(typeof Kakao==='undefined'||!Kakao.isInitialized()){showToast('카카오톡 SDK를 초기화할 수 없습니다','error');return;}const d=currentDetailData,code=insurerCommissionCodes[insurerName]||'입력안함';let insuranceAge=null;const bm=d.client_birth?.match(/^(\d{4})-(\d{2})-(\d{2})$/);if(bm)insuranceAge=calculateInsuranceAgeValue(bm[1],bm[2],bm[3]);let t=`[${insurerName} 설계의뢰입니다]\n\n• 고객: ${d.client_name}\n• 성별: ${d.client_gender}\n• 생년월일/연령대: ${d.client_birth}\n`;if(insuranceAge!==null)t+=`• 보험상령나이: ${insuranceAge}세\n`;t+=`• 담보: ${d.products_text}\n• 예산: ${d.premium_min}~${d.premium_max}만원\n`;if(d.medical_info)t+=`• ${d.medical_info}\n`;if(d.screening_type)t+=`• 심사: ${d.screening_type}\n`;if(d.payment_period||d.coverage_period)t+=`• 기간: ${d.payment_period||'-'} / ${d.coverage_period||'-'}\n`;if(d.refund_type)t+=`• 환급: ${d.refund_type}\n`;if(d.additional_info)t+=`• 추가정보: ${d.additional_info}\n`;t+=`\n• 설계사 위촉코드: ${code}`;try{Kakao.Link.sendDefault({objectType:'text',text:t,link:{mobileWebUrl:'https://gaworld.kr/infra',webUrl:'https://gaworld.kr/infra'},buttonTitle:'모두의전산'});showToast(`✅ ${insurerName}로 공유되었습니다!`,'success');}catch(err){showToast('공유에 실패했습니다','error');}}

// ============================================
// 유틸리티
// ============================================
function showToast(message,type='info'){const toast=document.getElementById('toast');toast.textContent=message;toast.className='toast show';if(type==='error')toast.classList.add('error');else if(type==='success')toast.classList.add('success');setTimeout(()=>toast.classList.remove('show'),3000);}
</script>

<script>
// v3.9.4 — 입력 완료 시에만 다음 칸 스크롤
document.addEventListener('DOMContentLoaded', function(){
    setTimeout(function(){
        var modal = document.getElementById('seolmaetalk-modal-container');
        if(!modal) return;

        function smoothScrollTo(element, offset){
            var container = modal.querySelector('.container');
            if(!container || !element) return;
            var targetTop = element.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - (offset || 80);
            var startTop = container.scrollTop;
            var distance = targetTop - startTop;
            if(Math.abs(distance) < 30) return;
            var duration = 900;
            var startTime = null;
            function easeInOutQuart(t){
                return t < 0.5 ? 8*t*t*t*t : 1 - Math.pow(-2*t+2, 4) / 2;
            }
            function animate(currentTime){
                if(!startTime) startTime = currentTime;
                var elapsed = currentTime - startTime;
                var progress = Math.min(elapsed / duration, 1);
                container.scrollTop = startTop + distance * easeInOutQuart(progress);
                if(progress < 1) requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);
        }

        function findNextGroup(formGroup){
            var next = formGroup.nextElementSibling;
            while(next && !next.classList.contains('form-group') && !next.classList.contains('btn-group')){
                next = next.nextElementSibling;
            }
            if(!next){
                var card = formGroup.closest('.card');
                if(card) next = card.nextElementSibling;
            }
            return next;
        }

        // 1. select 변경 시 → 바로 다음 칸
        modal.addEventListener('change', function(e){
            if(e.target.tagName !== 'SELECT') return;
            var formGroup = e.target.closest('.form-group');
            if(!formGroup) return;
            var next = findNextGroup(formGroup);
            if(next) setTimeout(function(){ smoothScrollTo(next); }, 250);
        });

        // 2. 텍스트 input, textarea → 포커스 떠날 때 (blur)
        modal.addEventListener('focusout', function(e){
            var tag = e.target.tagName;
            var type = e.target.type;
            if(tag === 'TEXTAREA' || (tag === 'INPUT' && (type === 'text' || type === 'number'))){
                if(!e.target.value.trim()) return;
                var formGroup = e.target.closest('.form-group');
                if(!formGroup) return;

                // 생년월일: 마지막 칸(일)에서만 스크롤
                if(e.target.closest('.birth-input-boxes')){
                    if(e.target.id !== 'birth-day') return;
                    if(!e.target.value.trim()) return;
                }

                var next = findNextGroup(formGroup);
                if(next) setTimeout(function(){ smoothScrollTo(next); }, 200);
            }
        });

        // 3. 라디오 선택 → 단일 선택이라 바로 다음 칸
        modal.addEventListener('click', function(e){
            var radioItem = e.target.closest('.radio-item');
            if(!radioItem) return;
            var formGroup = radioItem.closest('.form-group');
            if(!formGroup) return;

            // 병력 "있음" 선택 시 → 세부입력 칸이 열리니까 거기로
            var radio = radioItem.querySelector('input[type="radio"]');
            if(radio && radio.name === 'medical-history' && radio.value === '있음'){
                setTimeout(function(){
                    var detail = document.getElementById('medical-detail-section');
                    if(detail && !detail.classList.contains('hidden')){
                        smoothScrollTo(detail);
                    }
                }, 400);
                return;
            }

            var next = findNextGroup(formGroup);
            if(next) setTimeout(function(){ smoothScrollTo(next); }, 400);
        });

        // 4. 칩(보험종류) → 스크롤 안 함 (여러개 선택 가능)

    }, 1000);
});
</script>

<style>
/* v3.9.5 — 미입력 필드 하이라이트 */
.field-error {
    border-color: #E74C3C !important;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.15) !important;
    animation: fieldShake 0.4s ease;
}
.field-error-group {
    position: relative;
}
.field-error-tip {
    position: absolute;
    bottom: -28px;
    left: 0;
    background: #E74C3C;
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 6px;
    white-space: nowrap;
    z-index: 100;
    animation: tipFadeIn 0.3s ease;
}
.field-error-tip::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 16px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #E74C3C;
}
@keyframes fieldShake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
}
@keyframes tipFadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>

<style>
/* v3.9.6 — 미입력 필드 하이라이트 + 이동 */
.field-error {
    border-color: #E74C3C !important;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.15) !important;
    animation: fieldShake 0.4s ease;
}
.field-error-group {
    position: relative;
}
.field-error-tip {
    position: absolute;
    bottom: -28px;
    left: 0;
    background: #E74C3C;
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 6px;
    white-space: nowrap;
    z-index: 100;
    animation: tipFadeIn 0.3s ease;
}
.field-error-tip::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 16px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #E74C3C;
}
@keyframes fieldShake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
}
@keyframes tipFadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>

<script>
// v3.9.6 — 미입력 필드 툴팁 + 해당 필드로 부드러운 이동
(function(){
    function clearErrors(){
        document.querySelectorAll('.field-error').forEach(function(el){ el.classList.remove('field-error'); });
        document.querySelectorAll('.field-error-tip').forEach(function(el){ el.remove(); });
        document.querySelectorAll('.field-error-group').forEach(function(el){ el.classList.remove('field-error-group'); });
    }

    function scrollToField(el){
        var modal = document.getElementById('seolmaetalk-modal-container');
        if(!modal || !el) return;
        var container = modal.querySelector('.container');
        if(!container) return;
        var formGroup = el.closest('.form-group') || el;
        var targetTop = formGroup.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 60;
        var startTop = container.scrollTop;
        var distance = targetTop - startTop;
        if(Math.abs(distance) < 20) return;
        var duration = 700;
        var startTime = null;
        function easeInOutQuart(t){ return t < 0.5 ? 8*t*t*t*t : 1 - Math.pow(-2*t+2, 4) / 2; }
        function animate(currentTime){
            if(!startTime) startTime = currentTime;
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            container.scrollTop = startTop + distance * easeInOutQuart(progress);
            if(progress < 1) requestAnimationFrame(animate);
            else {
                if(el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA'){
                    el.focus();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    function showFieldError(el, msg){
        if(!el) return;
        var formGroup = el.closest('.form-group');
        if(formGroup){
            formGroup.classList.add('field-error-group');
            var old = formGroup.querySelector('.field-error-tip');
            if(old) old.remove();
            var tip = document.createElement('div');
            tip.className = 'field-error-tip';
            tip.textContent = msg;
            formGroup.appendChild(tip);
            setTimeout(function(){ 
                if(tip.parentNode) tip.remove();
                if(el.classList) el.classList.remove('field-error');
                if(formGroup.classList) formGroup.classList.remove('field-error-group');
            }, 3000);
        }
        if(el.classList) el.classList.add('field-error');
        // 해당 필드로 부드럽게 이동
        setTimeout(function(){ scrollToField(el); }, 50);
    }

    var _origValidate = validateCurrentStep;
    validateCurrentStep = function(){
        clearErrors();
        var step = appState.currentStep;

        if(step === 1){
            var name = document.getElementById('client-name');
            if(!name.value.trim()){
                showFieldError(name, '이름을 입력해주세요');
                return false;
            }
            if(!document.getElementById('gender-male').checked && !document.getElementById('gender-female').checked){
                var genderGroup = document.getElementById('gender-male').closest('.form-group');
                showFieldError(genderGroup, '성별을 선택해주세요');
                return false;
            }
            if(birthInputMode === 'birth'){
                var y = document.getElementById('birth-year'), m = document.getElementById('birth-month'), d = document.getElementById('birth-day');
                if(!y.value.trim() || !m.value.trim() || !d.value.trim()){
                    var empty = !y.value.trim() ? y : (!m.value.trim() ? m : d);
                    showFieldError(empty, '생년월일을 모두 입력해주세요');
                    return false;
                }
            } else {
                var age = document.getElementById('age-range-select');
                if(!age.value){
                    showFieldError(age, '연령대를 선택해주세요');
                    return false;
                }
            }
            if(!document.querySelector('input[name="medical-history"]:checked')){
                var medGroup = document.getElementById('medical-none').closest('.form-group');
                showFieldError(medGroup, '병력 유무를 선택해주세요');
                return false;
            }
        }

        if(step === 2){
            if(appState.selectedProducts.length === 0){
                var chips = document.getElementById('product-chips');
                showFieldError(chips, '보험 종류를 선택해주세요');
                return false;
            }
            var min = document.getElementById('premium-min'), max = document.getElementById('premium-max');
            if(!min.value || !max.value){
                var empty = !min.value ? min : max;
                showFieldError(empty, '월 납입료를 입력해주세요');
                return false;
            }
            if(parseInt(min.value) > parseInt(max.value)){
                showFieldError(min, '최소가 최대보다 클 수 없습니다');
                return false;
            }
        }

        return true;
    };

    document.addEventListener('input', function(){ clearErrors(); });
    document.addEventListener('change', function(){ clearErrors(); });
})();
</script>
