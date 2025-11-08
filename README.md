<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>설매Talk - 설계의뢰 시스템</title>
    
    <!-- OG 태그 (카톡 공유) -->
    <meta property="og:title" content="설매Talk - 설계의뢰">
    <meta property="og:description" content="손해보험사 설계의뢰를 쉽게 관리하세요">
    <meta property="og:url" content="">
    <meta property="og:type" content="website">
    
    <link rel="stylesheet" href="https://cdn.imweb.me/upload/fonts/icomoon/1622172175380/icon.css">
    <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-solid-rounded/css/uicons-solid-rounded.css">
    
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4" crossorigin="anonymous"></script>

    <style>
/* ============================================
   모달 오버레이 & 컨테이너
   ============================================ */
#seolmaetalk-modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    z-index: 999999;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 20px;
}

	  #sort-type {
  appearance: none; /* 기본 화살표 제거 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='black' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center; /* 오른쪽에서 12px 떨어지게 */
  background-size: 18px;
  padding-right: 40px; /* 화살표 공간 확보 */
}
	  
	  
#seolmaetalk-modal-overlay.active {
    display: flex;
    align-items: center;
    justify-content: center;
}

#seolmaetalk-modal-container {
    background: white;
    border-radius: 16px;
    max-width: 580px;
    width: 100%;
    max-height: 90vh;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    position: relative;
    animation: modalSlideIn 0.3s ease-out;
    display: flex;
    flex-direction: column;
}

#seolmaetalk-modal-container .container {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    max-width: 100%;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.seolmaetalk-header-wrapper {
    position: sticky !important;
    top: 0 !important;
    background: linear-gradient(99deg, #fce000 0%, #fed100 100%) !important;
    border-bottom: none !important;
    padding: 16px 24px !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    border-radius: 16px 16px 0 0 !important;
    z-index: 10 !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
    flex-shrink: 0 !important;
}

.seolmaetalk-header-title {
    font-size: 18px !important;
    font-weight: 700 !important;
    color: #371c1d !important;
    margin: 0 !important;
    text-shadow: none !important;
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
}

.seolmaetalk-header-logo {
    width: auto;
    height: 30px;
    object-fit: contain;
    cursor: pointer;
}

.seolmaetalk-header-controls {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
}

.seolmaetalk-header-back {
    background: rgba(0, 0, 0, 0.1) !important;
    border: none !important;
    font-size: 24px !important;
    cursor: pointer !important;
    padding: 0 !important;
    width: 36px !important;
    height: 36px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: #371c1d !important;
    transition: all 0.2s !important;
    border-radius: 8px !important;
    opacity: 0.7 !important;
}

.seolmaetalk-header-back:hover {
    background: rgba(0, 0, 0, 0.15) !important;
    opacity: 1 !important;
    transform: scale(1.05) !important;
}

.seolmaetalk-header-back.hidden-btn {
    visibility: hidden !important;
}

.seolmaetalk-header-close {
    background: rgba(0, 0, 0, 0.1) !important;
    border: none !important;
    font-size: 28px !important;
    cursor: pointer !important;
    padding: 0 !important;
    width: 36px !important;
    height: 36px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: #371c1d !important;
    transition: all 0.2s !important;
    border-radius: 8px !important;
}

.seolmaetalk-header-close:hover {
    background: rgba(0, 0, 0, 0.2) !important;
    transform: scale(1.1) !important;
}

:root {
    --brand: #3a5df4;
    --brand-ink: #2845c4;
    --brand-light: #5a7af7;
    --kakao: #FEE500;
    --kakao-text: #000000;
    --text: #0a0a0a;
    --muted: #6b7280;
    --bg: #ffffff;
    --surface: #f8f9fe;
    --line: #e5e7eb;
    --error: #dc2626;
    --success: #059669;
    --radius: 8px;
    --shadow: 0 1px 3px rgba(0,0,0,0.1);
}

* {
    box-sizing: border-box;
}

.tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    border-bottom: 2px solid var(--line);
}

.tab {
    flex: 1;
    padding: 12px 16px;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    color: var(--muted);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: -2px;
}

.tab:hover {
    color: var(--brand);
}

.tab.active {
    color: var(--brand);
    border-bottom-color: var(--brand);
}

.stepper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
    padding: 0 20px;
}

.step {
    flex: 1;
    text-align: center;
    position: relative;
}

.step::before {
    content: '';
    position: absolute;
    top: 16px;
    left: 50%;
    width: 100%;
    height: 2px;
    background: var(--line);
    z-index: 0;
}

.step:first-child::before {
    display: none;
}

.step-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--surface);
    border: 2px solid var(--line);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 8px;
    font-weight: 600;
    font-size: 14px;
    color: var(--muted);
    position: relative;
    z-index: 1;
    transition: all 0.3s;
}

.step.active .step-circle {
    background: var(--brand);
    border-color: var(--brand);
    color: white;
}

.step.completed .step-circle {
    background: var(--success);
    border-color: var(--success);
    color: white;
}

.step-label {
    font-size: 12px;
    color: var(--muted);
    font-weight: 500;
}

.step.active .step-label {
    color: var(--brand);
    font-weight: 600;
}

.tab-content {
    display: none;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
}

.tab-content.active {
    display: block;
}

.card {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 24px;
    margin-bottom: 16px;
    box-shadow: var(--shadow);
    box-sizing: border-box;
    max-width: 100%;
    width: 100%;
}

.card-title {
    font-size: 22px !important;
    font-weight: 400;
    color: #2c2c2c;
    margin-bottom: 16px;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    font-size: 16px !important;
    color: #494c51 !important;
    font-weight: 500 !important;
    margin-bottom: 8px !important;
}

.form-label .required {
    color: var(--error);
    margin-left: 2px;
}

.form-hint {
    font-size: 12px;
    color: var(--muted);
    margin-top: 4px;
}

.form-input,
.form-select,
.form-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    font-size: 15px;
    font-family: inherit;
    transition: all 0.2s;
    box-sizing: border-box;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
    outline: none;
    border-color: var(--brand);
    box-shadow: 0 0 0 3px rgba(58, 93, 244, 0.1);
}

.form-textarea {
    resize: vertical;
    min-height: 80px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.birth-input-boxes {
    display: flex;
    align-items: center;
    gap: 8px;
}

.birth-box-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.birth-box {
    width: 100%;
    padding: 14px;
    border: 2px solid var(--line);
    border-radius: var(--radius);
    font-size: 16px;
    text-align: center;
    font-weight: 500;
    transition: all 0.2s;
    background: white;
}

.birth-box:focus {
    outline: none;
    border-color: var(--brand);
    box-shadow: 0 0 0 3px rgba(58, 93, 244, 0.1);
}

.birth-box::placeholder {
    color: #d1d5db;
}

.birth-label {
    font-size: 13px;
    color: var(--muted);
    font-weight: 500;
}

.birth-separator {
    font-size: 20px;
    color: var(--muted);
    padding: 0 4px;
    margin-top: 20px;
}

.chip-group {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
}

@media (max-width: 600px) {
    .chip-group {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 400px) {
    .chip-group {
        grid-template-columns: repeat(2, 1fr);
    }
}

.chip {
    padding: 16px 8px;
    background: white;
    border: 2px solid var(--line);
    border-radius: var(--radius);
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 56px;
    white-space: nowrap;
}

.chip:hover {
    border-color: var(--brand);
    background: var(--surface);
}

.chip.selected {
    background: var(--brand);
    border-color: var(--brand);
    color: white;
}

.insurer-logo-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 4px;
}

@media (max-width: 600px) {
    .insurer-logo-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 400px) {
    .insurer-logo-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

.insurer-logo-item {
    position: relative;
    aspect-ratio: 1 / 1;
    border: 3px solid var(--line);
    border-radius: var(--radius);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1px;
}

.insurer-logo-item:hover {
    border-color: var(--brand);
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(58, 93, 244, 0.2);
}

.insurer-logo-item.selected {
    border-color: var(--brand);
    background: white;
    box-shadow: 0 4px 16px rgba(58, 93, 244, 0.3);
}

.insurer-logo-item.selected::after {
    content: '✓';
    position: absolute;
    top: 6px;
    right: 6px;
    width: 24px;
    height: 24px;
    background: var(--brand);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
}

.insurer-logo-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.3s;
}

.insurer-logo-item:hover .insurer-logo-img {
    transform: scale(1.05);
}

.credentials-logo-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
}

@media (max-width: 600px) {
    .credentials-logo-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

.credentials-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.credentials-logo {
    width: 100%;
    aspect-ratio: 1 / 1;
    border: 2px solid var(--line);
    border-radius: var(--radius);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    margin-bottom: 8px;
    transition: all 0.2s;
}

.credentials-logo:hover {
    border-color: var(--brand);
    box-shadow: 0 2px 8px rgba(58, 93, 244, 0.15);
}

.credentials-logo img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
}

.credentials-logo.preparing {
    color: var(--muted);
    font-size: 12px;
    font-weight: 600;
}

.credentials-input-wrapper {
    width: 100%;
}

.credentials-input-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--brand-ink);
    margin-bottom: 6px;
    display: block;
    text-align: left;
}

.credentials-code-input {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    font-size: 13px;
    font-family: inherit;
}

.credentials-code-input:focus {
    outline: none;
    border-color: var(--brand);
    box-shadow: 0 0 0 2px rgba(58, 93, 244, 0.1);
}

.credentials-code-input::placeholder {
    color: #d1d5db;
}

.btn {
    padding: 12px 20px;
    border: none;
    border-radius: var(--radius);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
}

.btn-primary {
    background: var(--brand);
    color: white;
}

.btn-primary:hover {
    background: var(--brand-ink);
}

.btn-secondary {
    background: white;
    color: var(--brand);
    border: 2px solid var(--brand);
}

.btn-secondary:hover {
    background: var(--surface);
}

.btn-success {
    background: var(--success);
    color: white;
}

.btn-success:hover {
    background: #047857;
}

.btn-group {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.btn-group .btn {
    flex: 1;
}

#share-buttons-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
}

.share-btn-insurer {
    width: 100%;
    padding: 16px 20px;
    background: var(--kakao);
    color: var(--kakao-text);
    border: 1px solid #e6e6e6;
    border-radius: 9px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.share-btn-insurer img {
    width: 20px;
    height: 20px;
    object-fit: contain;
}

.share-btn-insurer:hover:not(:disabled) {
    background: #e6d000;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.12);
}

.share-btn-insurer:disabled {
    background: #d1d5db;
    color: #6b7280;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.radio-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.radio-item {
    padding: 14px;
    border: 2px solid var(--line);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
}

.radio-item:hover {
    background: var(--surface);
    border-color: var(--brand);
}

.radio-item input[type="radio"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: var(--brand);
}

.radio-item label {
    flex: 1;
    cursor: pointer;
    font-size: 15px;
    color: var(--text);
}

.conditional-section {
    margin-top: 16px;
    padding: 16px;
    background: white;
    border: 1px solid var(--line);
    border-radius: var(--radius);
}

.preview-card {
    background: white;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 16px;
}

.preview-row {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid var(--line);
}

.preview-row:last-child {
    border-bottom: none;
}

.preview-label {
    min-width: 100px;
    font-weight: 600;
    color: var(--brand-ink);
    font-size: 14px;
}

.preview-value {
    flex: 1;
    color: var(--text);
    font-size: 14px;
}

.text-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--brand-ink);
    margin-bottom: 8px;
}

.text-output {
    background: white;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 14px;
    font-size: 14px;
    line-height: 1.7;
    color: var(--text);
    white-space: pre-wrap;
    word-break: break-word;
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9999999;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.modal.active {
    display: flex;
}

.modal-content {
    background: white;
    border-radius: 16px;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    position: relative;
    display: flex;
    flex-direction: column;
    animation: modalSlideIn 0.3s ease-out;
}

.modal-content > .modal-body {
    flex: 1;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: linear-gradient(268deg, #718bd1 0%, #d6e5ff 100%);
    border-radius: 16px 16px 0 0;
    position: sticky;
    top: 0;
    z-index: 100;
    flex-shrink: 0;
}

.modal-title {
    font-size: 18px;
    font-weight: 700;
    color: #371c1d;
}

.modal-close {
    background: rgba(0, 0, 0, 0.1);
    border: none;
    font-size: 28px;
    color: #371c1d;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    border-radius: 6px;
}

.modal-close:hover {
    background: rgba(0, 0, 0, 0.2);
}

.modal-body {
    padding: 20px;
    overflow-y: auto;
}

.completion-modal-content {
    text-align: center;
    padding: 40px 20px;
}

.completion-icon {
    font-size: 60px;
    margin-bottom: 20px;
}

.completion-message {
    font-size: 18px;
    font-weight: 600;
    color: var(--brand-ink);
    margin-bottom: 12px;
}

.completion-submessage {
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 30px;
}

.credential-item {
    background: white;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 14px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.credential-info {
    flex: 1;
}

.credential-name {
    font-weight: 600;
    color: var(--brand-ink);
    margin-bottom: 4px;
    font-size: 15px;
}

.credential-detail {
    font-size: 13px;
    color: var(--muted);
}

.credential-actions {
    display: flex;
    gap: 8px;
}

.icon-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 4px 8px;
    transition: transform 0.2s;
}

.icon-btn:hover {
    transform: scale(1.1);
}

.request-list {
    max-height: 600px;
    overflow-y: auto;
}

.request-item {
    background: white;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.2s;
}

.request-item:hover {
    border-color: var(--brand);
    box-shadow: var(--shadow);
}

.request-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.request-date {
    font-size: 14px;
    color: #ff7096;
    font-weight: 600;
}
.request-type {
    font-size: 13px;
    padding: 4px 10px;
    background: var(--surface);
    border-radius: 12px;
    color: var(--brand);
    font-weight: 600;
}

.request-summary {
    font-size: 16px;
    color: #282828;
    line-height: 1.5;
    margin-bottom: 4px;
    font-weight: 500;
}

.loading {
    text-align: center;
    padding: 40px 20px;
    color: var(--muted);
}

.spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 16px;
    border: 4px solid var(--line);
    border-top-color: var(--brand);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.text-center {
    text-align: center;
}

.hidden {
    display: none !important;
}

.mb-4 {
    margin-bottom: 16px;
}

.mt-4 {
    margin-top: 16px;
}

.toast {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: var(--text);
    color: white;
    padding: 14px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-size: 14px;
    font-weight: 500;
    z-index: 10000000;
    opacity: 0;
    transition: all 0.3s;
    max-width: 90%;
    text-align: center;
}

.toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

.toast.error {
    background: var(--error);
}

.toast.success {
    background: var(--success);
}

.greeting-section {
    background: white;
    border-radius: 12px;
    padding: 22px 0px 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    gap: 10px;
    box-sizing: border-box;
    max-width: 100%;
    width: 100%;
    text-align: center;
}

.greeting-text {
    font-size: 28px;
    font-weight: 500;
    color: #000e48;
    line-height: 1.2;
    flex: 1;
    text-align: left;
    width: 100%;
    letter-spacing: -1px;
    padding-bottom: 11px;
    padding-top: 30px;
}

.greeting-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    width: 100%;
    max-width: none;
}

.greeting-btn {
    padding: 23px 16px;
    border: none;
    background: linear-gradient(135deg, #f0f4ff 0%, #f8f9ff 100%);
    color: #2d3455;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    white-space: normal;
    min-width: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    position: relative;
    overflow: hidden;
}

.greeting-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(102, 126, 234, 0.05);
    opacity: 0;
    transition: opacity 0.3s;
}

.greeting-btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(102, 126, 234, 0.2);
    background: linear-gradient(135deg, #e8f0ff 0%, #f0f4ff 100%);
}

.greeting-btn:hover::before {
    opacity: 1;
}

.greeting-btn i {
    font-size: 32px;
    color: var(--brand);
    position: relative;
    z-index: 1;
}

.greeting-btn:hover {
    background: var(--surface);
    transform: translateY(-2px);
}

.mode-selector {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
}

.mode-btn {
    flex: 1;
    padding: 12px 16px;
    background: white;
    border: 2px solid var(--line);
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s;
}

.mode-btn.active {
    background: var(--brand);
    border-color: var(--brand);
    color: white;
}

.filter-section {
    background: white;
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 16px;
    border: 1px solid var(--line);
    box-sizing: border-box;
    width: 100%;
}

.filter-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    box-sizing: border-box;
}

.back-btn-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.back-btn-wrapper .btn {
    padding: 10px 16px;
    font-size: 14px;
}

.greeting-content-wrapper {
    display: flex;
    gap: 20px;
    width: 100%;
    align-items: flex-start;
}

.greeting-text-wrapper {
    flex: 1;
}

.greeting-image {
    width: 36%;
    height: auto;
    object-fit: contain;
    flex-shrink: 0;
}

/* 의뢰 상세 모달 개선 */
.detail-modal-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.detail-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.detail-section-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--brand-ink);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}

.detail-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.detail-info-item {
    background: var(--surface);
    padding: 12px;
    border-radius: var(--radius);
    border: 1px solid var(--line);
}

.detail-info-label {
    font-size: 12px;
    color: var(--muted);
    font-weight: 500;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.detail-info-value {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
}

.detail-text-section {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 16px;
}

.detail-text-label {
    font-size: 12px;
    font-weight: 700;
    color: var(--brand-ink);
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin-bottom: 10px;
    display: block;
}

.detail-text-content {
    background: white;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 12px;
    font-size: 13px;
    line-height: 1.6;
    color: var(--text);
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto;
    font-family: 'Courier New', monospace;
}

.detail-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 20px;
}

.detail-btn {
    padding: 14px 16px;
    border: none;
    border-radius: var(--radius);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.detail-btn-secondary {
    background: white;
    color: var(--brand);
    border: 2px solid var(--brand);
}

.detail-btn-secondary:hover {
    background: var(--surface);
}

.detail-btn-primary {
    background: var(--brand);
    color: white;
}

.detail-btn-primary:hover {
    background: var(--brand-ink);
}

/* 통합 검색창 */
.unified-search-wrapper {
    position: relative;
    width: 100%;
}

.unified-search-input {
    width: 100%;
    padding: 12px 16px 12px 40px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    font-size: 14px;
    transition: all 0.2s;
    background: white;
}

.unified-search-input:focus {
    outline: none;
    border-color: var(--brand);
    box-shadow: 0 0 0 3px rgba(58, 93, 244, 0.1);
}

.unified-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    font-size: 16px;
    pointer-events: none;
}

.search-hint {
    font-size: 12px;
    color: var(--muted);
    margin-top: 6px;
}
    </style>
</head>
<body>

<!-- 테스트 버튼 -->
<button class="test-button" onclick="openSeolmaetalkModal()">🚀 설매톡 열기</button>

<!-- 설매톡 모달 -->
<div id="seolmaetalk-modal-overlay">
    <div id="seolmaetalk-modal-container" onclick="event.stopPropagation()">
        <div class="seolmaetalk-header-wrapper">
            <div style="display: flex; align-items: center; gap: 12px;">
                <img src="https://cdn.imweb.me/upload/S2016083157c63a62163fa/a1f171943932c.png" alt="설매톡" class="seolmaetalk-header-logo" onclick="goToHome()">
            </div>
            <div class="seolmaetalk-header-controls">
                <button class="seolmaetalk-header-back hidden-btn" id="header-back-btn" onclick="goBack()" title="이전 페이지">←</button>
                <button class="seolmaetalk-header-close" onclick="closeSeolmaetalkModal()">×</button>
            </div>
        </div>
        
        <div class="container">
            
            <!-- 의뢰 작성 탭 -->
            <div class="tab-content active" id="form-tab">
                <div class="greeting-section">
                    <div class="greeting-content-wrapper">
                        <div class="greeting-text-wrapper">
                            <div class="greeting-text" id="greeting-text">홍길동님,<br>안녕하세요!<br>설계 요청을 시작해봐요.</div>
                        </div>
                        <img src="https://cdn.imweb.me/upload/S2016083157c63a62163fa/f2fab4205efd6.png" alt="설계 시작" class="greeting-image">
                    </div>
                    <div class="greeting-buttons">
                        <button class="greeting-btn" onclick="switchGreetingMode('history')">
                            <i class="fi fi-sr-calendar-clock"></i>
                            의뢰내역
                        </button>
                        <button class="greeting-btn" onclick="switchGreetingMode('code')">
                            <i class="fi fi-sr-list"></i>
                            위촉코드
                        </button>
                        <button class="greeting-btn" onclick="switchGreetingMode('dashboard')">
                            <i class="fi fi-sr-chart-pie-alt"></i>
                            판매비중
                        </button>
                    </div>
                </div>

                <!-- STEP 1: 고객 정보 -->
                <div class="step-content" id="step-1">
                    <div class="card">
                        <h2 class="card-title">고객 정보를 입력해주세요.</h2>
                        
                        <div class="form-group">
                            <label class="form-label">
                                이름 또는 별칭<span class="required">*</span>
                            </label>
                            <input type="text" class="form-input" id="client-name" placeholder="예: 홍길동 또는 길동이">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                피보험자 성별<span class="required">*</span>
                            </label>
                            <div style="display: flex; gap: 20px;">
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="radio" name="client-gender" value="남성" id="gender-male" style="margin-right: 8px; width: 20px; height: 20px; cursor: pointer;">
                                    <span style="font-size: 15px;">남성</span>
                                </label>
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="radio" name="client-gender" value="여성" id="gender-female" style="margin-right: 8px; width: 20px; height: 20px; cursor: pointer;">
                                    <span style="font-size: 15px;">여성</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                생년월일 혹은 연령대 둘 중 하나 필수 선택<span class="required">*</span>
                            </label>
                            <div class="form-row" style="margin-bottom: 12px;">
                                <button type="button" class="btn btn-primary" id="birth-mode-btn" onclick="toggleBirthMode('birth')" style="flex: 1;">생년월일</button>
                                <button type="button" class="btn btn-secondary" id="age-mode-btn" onclick="toggleBirthMode('age')" style="flex: 1;">연령대</button>
                            </div>
                            
                            <div id="birth-input-container">
                                <div class="birth-input-boxes">
                                    <div class="birth-box-wrapper">
                                        <input type="text" class="birth-box" id="birth-year" placeholder="YYYY" maxlength="4" inputmode="numeric">
                                        <span class="birth-label">년</span>
                                    </div>
                                    <span class="birth-separator">-</span>
                                    <div class="birth-box-wrapper">
                                        <input type="text" class="birth-box" id="birth-month" placeholder="MM" maxlength="2" inputmode="numeric">
                                        <span class="birth-label">월</span>
                                    </div>
                                    <span class="birth-separator">-</span>
                                    <div class="birth-box-wrapper">
                                        <input type="text" class="birth-box" id="birth-day" placeholder="DD" maxlength="2" inputmode="numeric">
                                        <span class="birth-label">일</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="age-input-container" style="display: none;">
                                <select class="form-select" id="age-range-select">
                                    <option value="">연령대 선택</option>
                                    <option value="태아/신생아">태아/신생아</option>
                                    <option value="10세 미만 아동">10세 미만 아동</option>
                                    <option value="10대">10대</option>
                                    <option value="20대">20대</option>
                                    <option value="30대">30대</option>
                                    <option value="40대">40대</option>
                                    <option value="50대">50대</option>
                                    <option value="60대">60대</option>
                                    <option value="70대">70대</option>
                                    <option value="80세 이상">80세 이상</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">병력 유무<span class="required">*</span></label>
                            <p class="form-hint mb-4">심사에 필요한 최소 정보만 확인합니다. 진단명·치료 여부·시기만 간단히 알려주세요.</p>
                            
                            <div class="radio-group">
                                <div class="radio-item">
                                    <input type="radio" name="medical-history" value="없음" id="medical-none">
                                    <label for="medical-none">없음</label>
                                </div>
                                <div class="radio-item">
                                    <input type="radio" name="medical-history" value="있음" id="medical-yes">
                                    <label for="medical-yes">있음</label>
                                </div>
                                <div class="radio-item">
                                    <input type="radio" name="medical-history" value="잘 모르겠음" id="medical-unknown">
                                    <label for="medical-unknown">잘 모르겠음</label>
                                </div>
                            </div>
                            
                            <div id="medical-detail-section" class="conditional-section hidden">
                                <div class="form-group">
                                    <label class="form-label">진단/증상</label>
                                    <input type="text" class="form-input" id="medical-diagnosis" placeholder="예: 고혈압">
                                    <p class="form-hint">예시: "고혈압 진단, 약 복용 중, 2년 전 시작. 입원·수술 없음."</p>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">상태</label>
                                    <select class="form-select" id="medical-status">
                                        <option value="">선택</option>
                                        <option value="진단받음">진단받음</option>
                                        <option value="치료 중">치료 중</option>
                                        <option value="치료 완료">치료 완료</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">시기</label>
                                    <select class="form-select" id="medical-period">
                                        <option value="">선택</option>
                                        <option value="최근 3개월">최근 3개월</option>
                                        <option value="3~12개월">3~12개월</option>
                                        <option value="1~3년">1~3년</option>
                                        <option value="3년 초과">3년 초과</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">입원/수술</label>
                                    <select class="form-select" id="medical-hospitalization">
                                        <option value="해당 없음">해당 없음</option>
                                        <option value="입원">입원</option>
                                        <option value="수술">수술</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">복용 약 (선택)</label>
                                    <input type="text" class="form-input" id="medical-medication" placeholder="복용 중인 약이 있다면 입력해주세요">
                                </div>
                            </div>
                            
                            <div id="medical-checkup-section" class="conditional-section hidden">
                                <div class="form-group">
                                    <label class="form-label">최근 1년 이내 건강검진에서 "추가 확인 필요" 안내를 받았나요?</label>
                                    <div class="radio-group">
                                        <div class="radio-item">
                                            <input type="radio" name="medical-checkup" value="예" id="checkup-yes">
                                            <label for="checkup-yes">예</label>
                                        </div>
                                        <div class="radio-item">
                                            <input type="radio" name="medical-checkup" value="아니오" id="checkup-no">
                                            <label for="checkup-no">아니오</label>
                                        </div>
                                        <div class="radio-item">
                                            <input type="radio" name="medical-checkup" value="기억나지 않음" id="checkup-unknown">
                                            <label for="checkup-unknown">기억나지 않음</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">그 외 보험 설계 시 꼭 필요한 정보를 입력해주세요. (선택)</label>
                            <textarea class="form-textarea" id="client-additional-info" placeholder="내용을 입력해주세요. (100자 이내)" maxlength="100" rows="4"></textarea>
                        </div>
                    </div>
                    
                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="nextStep(2)">다음</button>
                    </div>
                </div>
                
                <!-- STEP 2: 의뢰 내용 -->
                <div class="step-content hidden" id="step-2">
                    <div class="card">
                        <h2 class="card-title">의뢰 내용</h2>
                        
                        <div class="form-group">
                            <label class="form-label">보험종류<span class="required">*</span></label>
                            <div class="chip-group" id="product-chips">
                                <div class="chip" data-value="종합(성인)">종합(성인)</div>
                                <div class="chip" data-value="종합(어린이)">종합(어린이)</div>
                                <div class="chip" data-value="암">암</div>
                                <div class="chip" data-value="뇌-심장">뇌-심장</div>
                                <div class="chip" data-value="수술비">수술비</div>
                                <div class="chip" data-value="치매-간병">치매-간병</div>
                                <div class="chip" data-value="후유장애">후유장애</div>
                                <div class="chip" data-value="입원비">입원비</div>
                                <div class="chip" data-value="실손의료비">실손의료비</div>
                                <div class="chip" data-value="운전자 / 상해">운전자/상해</div>
                                <div class="chip" data-value="치아">치아</div>
                                <div class="chip" data-value="어린이">어린이</div>
                                <div class="chip" data-value="주택화재">주택화재</div>
                                <div class="chip" data-value="펫">펫</div>
                                <div class="chip" data-value="사망(종신)">사망(종신)</div>
                                <div class="chip" data-value="사망(정기)">사망(정기)</div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">월 납입료<span class="required">*</span></label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="flex: 1; text-align: center;">
                                    <div style="font-size: 13px; color: var(--muted); margin-bottom: 6px;">최소</div>
                                    <input type="number" class="form-input" id="premium-min" placeholder="숫자입력" min="0" style="text-align: center;">
                                    <div style="font-size: 13px; color: var(--muted); margin-top: 6px; text-align: right;">만원</div>
                                </div>
                                <div style="font-size: 18px; color: var(--muted); margin-top: 30px;">~</div>
                                <div style="flex: 1; text-align: center;">
                                    <div style="font-size: 13px; color: var(--muted); margin-bottom: 6px;">최대</div>
                                    <input type="number" class="form-input" id="premium-max" placeholder="숫자입력" min="0" style="text-align: center;">
                                    <div style="font-size: 13px; color: var(--muted); margin-top: 6px; text-align: right;">만원</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">심사조건</label>
                            <select class="form-select" id="screening-type">
                                <option value="">미선택</option>
                                <option value="일반심사">일반심사</option>
                                <option value="건강체심사">건강체심사</option>
                                <option value="간편심사">간편심사</option>
                            </select>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">납입 기간</label>
                                <select class="form-select" id="payment-period">
                                    <option value="">선택</option>
                                    <option value="10년납">10년납</option>
                                    <option value="15년납">15년납</option>
                                    <option value="20년납">20년납</option>
                                    <option value="전기납">전기납</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">보장 기간</label>
                                <select class="form-select" id="coverage-period">
                                    <option value="">선택</option>
                                    <option value="80세만기">80세만기</option>
                                    <option value="100세만기">100세만기</option>
                                    <option value="종신">종신</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">환급조건</label>
                            <select class="form-select" id="refund-type">
                                <option value="">미선택</option>
                                <option value="해약환급금 지급형">해약환급금 지급형</option>
                                <option value="해약환급금 미지급형">해약환급금 미지급형</option>
                                <option value="해약환급금 일부지급형">해약환급금 일부지급형</option>
                                <option value="갱신형">갱신형</option>
                                <option value="만기형">만기형</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="btn-group">
                        <button class="btn btn-secondary" onclick="prevStep(1)">이전</button>
                        <button class="btn btn-primary" onclick="nextStep(3)">다음</button>
                    </div>
                </div>
                
                <!-- STEP 3: 요약 & 공유 -->
                <div class="step-content hidden" id="step-3">
                    <div class="card">
                        <h2 class="card-title">의뢰 내용 확인</h2>
                        <div class="preview-card" id="preview-card"></div>
                    </div>
                    
                    <div class="card">
                        <h2 class="card-title">전달할 손해보험사 선택<span class="required">*</span></h2>
                        <p class="form-hint mb-4">설계 의뢰를 전달할 손해보험사를 선택해주세요. (복수 선택 가능)</p>
                        <div class="insurer-logo-grid" id="final-insurer-chips"></div>
                    </div>
                    
                    <div id="share-buttons-container"></div>
                    
                    <div class="btn-group">
                        <button class="btn btn-secondary" onclick="prevStep(2)">이전</button>
                    </div>
                </div>
            </div>
            
            <!-- 마이페이지 탭 -->
            <div class="tab-content" id="mypage-tab">
                <div class="card">
                    <h2 class="card-title" id="mypage-title">나의 설계의뢰 내역</h2>
                    
                    <!-- 통합 검색 섹션 -->
                    <div style="display: grid; grid-template-columns: 1.85fr 1fr; gap: 12px; margin-bottom: 20px; align-items: center;">
                      <div class="unified-search-wrapper">
                            <i class="btb bt-search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #3a5df4; pointer-events: none; font-size: 18px;"></i>
                            <input type="text" class="unified-search-input" id="unified-search-box" placeholder="이름, 보험사, 질병 검색..." oninput="applyFilters()" style="height: 44px; padding: 12px 16px 12px 40px; margin-bottom: 0px;">
                        </div>


                        <select class="form-select" id="sort-type" style="padding: 12px 12px; height: 44px;" onchange="applyFilters()">
                            <option value="latest">최신순</option>
                            <option value="oldest">오래된순</option>
                            <option value="name">고객명(가나다순)</option>
                        </select>
                    </div>
                    
                    <div id="request-list" class="request-list">
                        <div class="loading">
                            <div class="spinner"></div>
                            <p>불러오는 중...</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 전산정보 탭 -->
            <div class="tab-content" id="credentials-tab">
                <div style="padding: 20px;">
                    <h2 class="card-title" style="margin-bottom: 24px;">전산정보 관리</h2>
                    <!-- 손해보험/생명보험 탭 -->
                    <div class="mode-selector" style="margin-bottom: 24px;">
                        <button class="mode-btn active" onclick="switchCredentialMode('손해보험')">손해보험</button>
                        <button class="mode-btn" onclick="switchCredentialMode('생명보험')">생명보험</button>
                    </div>
                    
                    <!-- 손해보험 입력 폼 -->
                    <div id="nonlife-credentials-section">
                        <p class="form-hint mb-4">손해보험사별 위촉코드를 입력해주세요.</p>
                        <div class="credentials-logo-grid" id="nonlife-insurers-container"></div>
                        <div class="btn-group" style="margin-top: 28px;">
                            <button class="btn btn-primary" style="width: 100%;" onclick="saveAllCredentials('nonlife')">저장</button>
                        </div>
                    </div>
                    
                    <!-- 생명보험 입력 폼 -->
                    <div id="life-credentials-section" style="display: none;">
                        <p style="text-align: center; color: var(--muted); padding: 40px 20px;">
                            <span style="font-size: 48px; display: block; margin-bottom: 12px;">🔧</span>
                            준비중입니다
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- 대시보드 탭 -->
            <div class="tab-content" id="dashboard-tab">
                <div class="card">
                    <h2 class="card-title">이달 판매 비중</h2>
                    <p class="form-hint mb-4" style="margin-bottom: 24px;">보험사별 설계의뢰 현황</p>
                    
                    <!-- 월 선택 -->
                    <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                        <input type="month" id="dashboard-month" class="form-input" onchange="loadDashboardData()" style="flex: 1; padding: 10px;">
                        <button class="btn btn-secondary" style="width: auto;" onclick="loadDashboardData()">새로고침</button>
                    </div>
                    
                    <!-- 요약 카드 -->
                    <div id="summary-cards" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;"></div>
                    
                    <!-- 차트 컨테이너 -->
                    <div id="charts-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                        <div id="pie-chart-container" style="background: white; border-radius: 8px; padding: 16px; border: 1px solid var(--line);"></div>
                        <div id="line-chart-container" style="background: white; border-radius: 8px; padding: 16px; border: 1px solid var(--line);"></div>
                    </div>
                    
                    <!-- 순위 테이블 -->
                    <div style="background: white; border-radius: 8px; border: 1px solid var(--line); overflow: hidden;">
                        <div style="padding: 16px; background: var(--surface); border-bottom: 1px solid var(--line); font-weight: 600;">
                            📊 보험사별 의뢰건수 순위 (Top 5)
                        </div>
                        <div id="ranking-table" style="padding: 16px;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 의뢰 상세 모달 -->
<div class="modal" id="detail-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">의뢰 상세</h3>
            <button class="modal-close" onclick="closeModal('detail-modal')">×</button>
        </div>
        <div class="modal-body">
            <div class="detail-modal-content" id="detail-content"></div>
        </div>
    </div>
</div>

<!-- 완료 모달 -->
<div class="modal" id="completion-modal">
    <div class="modal-content">
        <div class="modal-header" style="background: linear-gradient(268deg, #718bd1 0%, #d6e5ff 100%) !important;">
            <h3 class="modal-title" style="color: #371c1d !important;">전달 완료</h3>
            <button class="modal-close" onclick="closeModal('completion-modal')" style="color: #371c1d !important;">×</button>
        </div>
        <div class="completion-modal-content">
            <div class="completion-icon">✅</div>
            <div class="completion-message">전달이 완료되었습니다</div>
            <div class="completion-submessage">해당 내용은 마이페이지에서 확인 가능합니다.</div>
            <button class="btn btn-primary" onclick="closeCompletionModal()" style="width: 100%; max-width: 200px;">확인</button>
        </div>
    </div>
</div>

<div class="toast" id="toast"></div>
<script>
// ============================================
// 설매톡 v2.5 - 통합 JavaScript (완벽 수정 버전)
// ✅ DB 저장 완벽 수정
// ✅ 위촉코드 저장 완벽 수정
// ✅ 카톡 공유 형식 개선 (예전 형식)
// ✅ 이미지 제거 - 텍스트 전체 표시!
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

let supabase = null;
let currentPlannerId = null;
let currentPlannerEmail = null;
let currentPlannerName = null;
let insurerCommissionCodes = {};
let birthInputMode = 'birth';
let currentCredentialMode = '손해보험';
let allRequests = [];
let previousTab = null;

const appState = {
    currentStep: 1,
    formData: {},
    selectedProducts: [],
    selectedInsurers: [],
    generatedTexts: { kakao: '', sms: '' },
    sharedInsurers: []
};

// ============================================
// 초기화
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    initKakao();
    initSupabase();
    await initUser();
    initTabs();
    initChips();
    initFormInputs();
    setupBirthdayInput();
    setupMedicalHistoryRadio();
    initDraggableModals();
});

function initKakao() {
    if (typeof Kakao !== 'undefined') {
        if (!Kakao.isInitialized()) {
            Kakao.init('2a2e79669ea6bbbf07f5d68ffa1cc67b');
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
    
    updateBackButtonVisibility();
    
    if (tabName === 'mypage') loadRequests();
    else if (tabName === 'credentials') loadCredentials();
    else if (tabName === 'dashboard') loadDashboardData();
}

function initChips() {
    document.querySelectorAll('#product-chips .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('selected');
            const value = chip.dataset.value;
            if (chip.classList.contains('selected')) {
                if (!appState.selectedProducts.includes(value)) appState.selectedProducts.push(value);
            } else {
                appState.selectedProducts = appState.selectedProducts.filter(p => p !== value);
            }
        });
    });
}

function initFormInputs() {
    document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
        input.addEventListener('change', collectFormData);
    });
}

function setupBirthdayInput() {
    const yearInput = document.getElementById('birth-year');
    const monthInput = document.getElementById('birth-month');
    const dayInput = document.getElementById('birth-day');
    const currentYear = new Date().getFullYear();
    
    yearInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        if (e.target.value.length === 4 && parseInt(e.target.value) <= currentYear) monthInput.focus();
    });
    
    monthInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        if (e.target.value.length >= 2) {
            const month = parseInt(e.target.value);
            if (month > 12) e.target.value = '12';
            if (e.target.value.length === 2) dayInput.focus();
        }
    });
    
    dayInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        if (e.target.value.length >= 2 && parseInt(e.target.value) > 31) e.target.value = '31';
    });
}

function setupMedicalHistoryRadio() {
    const medicalRadios = document.querySelectorAll('input[name="medical-history"]');
    const detailSection = document.getElementById('medical-detail-section');
    const checkupSection = document.getElementById('medical-checkup-section');
    
    medicalRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const value = e.target.value;
            if (value === '있음') {
                detailSection.classList.remove('hidden');
                checkupSection.classList.add('hidden');
            } else if (value === '잘 모르겠음') {
                checkupSection.classList.remove('hidden');
                detailSection.classList.add('hidden');
            } else {
                detailSection.classList.add('hidden');
                checkupSection.classList.add('hidden');
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
    
    if (mode === 'birth') {
        birthBtn.classList.remove('btn-secondary');
        birthBtn.classList.add('btn-primary');
        ageBtn.classList.remove('btn-primary');
        ageBtn.classList.add('btn-secondary');
        birthContainer.style.display = 'block';
        ageContainer.style.display = 'none';
    } else {
        ageBtn.classList.remove('btn-secondary');
        ageBtn.classList.add('btn-primary');
        birthBtn.classList.remove('btn-primary');
        birthBtn.classList.add('btn-secondary');
        ageContainer.style.display = 'block';
        birthContainer.style.display = 'none';
    }
}

// ============================================
// 모달 제어
// ============================================
function openSeolmaetalkModal() {
    document.getElementById('seolmaetalk-modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSeolmaetalkModal() {
    document.getElementById('seolmaetalk-modal-overlay').classList.remove('active');
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

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) e.target.classList.remove('active');
});

// ============================================
// 단계 이동
// ============================================
function nextStep(stepNum) {
    if (!validateCurrentStep()) return;
    
    if (stepNum === 3) {
        collectFormData();
        generateTexts();
        renderPreview();
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
    if (birthInputMode === 'birth') {
        const year = document.getElementById('birth-year').value.trim();
        const month = document.getElementById('birth-month').value.trim();
        const day = document.getElementById('birth-day').value.trim();
        if (year && month && day) clientBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
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
    } else if (medicalHistory?.value === '잘 모르겠음') {
        medicalInfo = `병력: 잘 모르겠음`;
    } else {
        medicalInfo = `병력: 없음`;
    }
    
    appState.formData = {
        clientName: document.getElementById('client-name').value.trim(),
        clientGender,
        clientBirth,
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
    if (data.medicalInfo) kakaoText += `• ${data.medicalInfo}\n`;
    if (data.screeningType) kakaoText += `• 심사: ${data.screeningType}\n`;
    if (data.paymentPeriod || data.coveragePeriod) kakaoText += `• 기간: ${data.paymentPeriod || '-'} / ${data.coveragePeriod || '-'}\n`;
    if (data.refundType) kakaoText += `• 환급: ${data.refundType}\n`;
    if (data.clientAdditionalInfo) kakaoText += `• 추가정보: ${data.clientAdditionalInfo}\n`;
    
    let smsText = `고객 ${data.clientName} / ${productsText.replace(/, /g, '·')} / ${data.premiumMin}~${data.premiumMax}만원`;
    if (data.screeningType) smsText += ` / ${data.screeningType}`;
    if (data.paymentPeriod && data.coveragePeriod) smsText += ` / ${data.paymentPeriod}·${data.coveragePeriod}`;
    if (data.refundType) smsText += ` / ${data.refundType}`;
    smsText += '.';
    
    appState.generatedTexts = { kakao: kakaoText, sms: smsText };
}

function renderPreview() {
    const data = appState.formData;
    let html = `<div class="preview-row"><div class="preview-label">고객</div><div class="preview-value">${data.clientName}</div></div>`;
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
    let html = '';
    INSURERS.forEach(insurer => {
        const logoUrl = INSURER_LOGOS[insurer] || 'https://via.placeholder.com/200x200';
        html += `<div class="insurer-logo-item" data-insurer="${insurer}"><img src="${logoUrl}" alt="${insurer}" class="insurer-logo-img"></div>`;
    });
    
    container.innerHTML = html;
    document.querySelectorAll('.insurer-logo-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('selected');
            updateShareButtons();
        });
    });
    
    appState.selectedInsurers = [];
    updateShareButtons();
}

function updateShareButtons() {
    const selectedItems = document.querySelectorAll('.insurer-logo-item.selected');
    appState.selectedInsurers = Array.from(selectedItems).map(item => item.dataset.insurer);
    
    const container = document.getElementById('share-buttons-container');
    
    if (appState.selectedInsurers.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 20px;">전달할 손해보험사를 선택해주세요</p>';
        return;
    }
    
    let html = '';
    appState.selectedInsurers.forEach(insurer => {
        const isShared = appState.sharedInsurers.includes(insurer);
        html += `<button class="share-btn-insurer" onclick="shareToInsurer('${insurer}')" ${isShared ? 'disabled' : ''}><i class="ii ii-kakaotalk" style="margin-right: 8px;"></i> ${isShared ? `${insurer} 매니저에게 전달완료` : `${insurer} 매니저에게 전달`}</button>`;
    });
    
    container.innerHTML = html;
}

// ============================================
// 카톡 공유 (최종 수정)
// ✅ Kakao.Link.sendDefault(text) 사용
// ✅ 생년월일/연령대 필수 포함
// ✅ 이름 전체 노출
// ✅ 링크 변경: https://gaworld.kr/infra
// ============================================

async function shareToInsurer(insurerName) {
    console.log('='.repeat(50));
    console.log('🔍 카톡 공유 시작:', insurerName);
    console.log('='.repeat(50));
    
    // 1. 기본 검증
    if (!appState.selectedInsurers.includes(insurerName)) {
        console.error('❌ 선택되지 않은 보험사');
        showToast('선택되지 않은 보험사입니다', 'error');
        return;
    }
    
    if (appState.sharedInsurers.includes(insurerName)) {
        console.warn('⚠️ 이미 공유된 보험사');
        showToast('이미 공유된 보험사입니다', 'info');
        return;
    }
    
    // 2. Kakao SDK 확인
    console.log('📱 Kakao 상태 확인...');
    console.log('  - typeof Kakao:', typeof Kakao);
    console.log('  - Kakao.isInitialized():', Kakao?.isInitialized?.());
    console.log('  - Kakao.Link:', !!Kakao?.Link);
    
    if (typeof Kakao === 'undefined') {
        console.error('❌ Kakao SDK 없음');
        showToast('❌ 카카오톡 SDK를 로드할 수 없습니다', 'error');
        return;
    }
    
    if (!Kakao.isInitialized()) {
        console.log('🔄 Kakao 재초기화 시도...');
        try {
            Kakao.init('2a2e79669ea6bbbf07f5d68ffa1cc67b');
            console.log('✅ Kakao 재초기화 성공');
        } catch (err) {
            console.error('❌ Kakao 초기화 실패:', err);
            showToast('카카오톡 초기화 실패', 'error');
            return;
        }
    }
    
    if (!Kakao.Link) {
        console.error('❌ Kakao.Link 없음');
        showToast('❌ 카카오톡 공유 기능을 사용할 수 없습니다', 'error');
        return;
    }
    
    // 3. 공유 텍스트 생성 (생년월일/연령대 필수 포함, 이름 전체 노출)
    const data = appState.formData;
    const commissionCode = insurerCommissionCodes[insurerName] || '입력안함';
    let productsText = data.products.length <= 3 
        ? data.products.join(', ') 
        : data.products.slice(0, 3).join(', ') + ` (+외 ${data.products.length - 3})`;
    
    let insurerText = `[${insurerName} 설계의뢰입니다]\n\n`;
    insurerText += `• 고객: ${data.clientName}\n`;
    insurerText += `• 생년월일/연령대: ${data.clientBirth}\n`;
    insurerText += `• 담보: ${productsText}\n`;
    insurerText += `• 예산: ${data.premiumMin}~${data.premiumMax}만원\n`;
    if (data.medicalInfo) insurerText += `• ${data.medicalInfo}\n`;
    if (data.screeningType) insurerText += `• 심사: ${data.screeningType}\n`;
    if (data.paymentPeriod || data.coveragePeriod) insurerText += `• 기간: ${data.paymentPeriod || '-'} / ${data.coveragePeriod || '-'}\n`;
    if (data.refundType) insurerText += `• 환급: ${data.refundType}\n`;
    if (data.clientAdditionalInfo) insurerText += `• 추가정보: ${data.clientAdditionalInfo}\n`;
    insurerText += `• 위촉코드: ${commissionCode}`;
    
    console.log('📝 공유 텍스트 생성 완료');
    console.log('  - 길이:', insurerText.length + '자');
    console.log('  - 미리보기:', insurerText.substring(0, 80) + '...');
    
    // 4. Kakao.Link.sendDefault API 호출 (TEXT 형식)
    try {
        console.log('📤 Kakao.Link.sendDefault 호출...');
        console.log('  - 형식: text (최대 길이 텍스트)');
        console.log('  - 링크: https://gaworld.kr/infra');
        
        Kakao.Link.sendDefault({
            objectType: 'text',
            text: insurerText,
            link: {
                mobileWebUrl: 'https://gaworld.kr/infra',
                webUrl: 'https://gaworld.kr/infra'
            }
        });
        
        console.log('✅ Kakao.Link.sendDefault 호출 성공');
        
        // 5. DB에 저장 (공유 후 즉시)
        console.log('💾 DB 저장 시작...');
        await saveRequest(insurerName);
        
        // 6. 상태 업데이트
        appState.sharedInsurers.push(insurerName);
        updateShareButtons();
        
        console.log('✅ 공유 완료!');
        console.log('  - 공유된 보험사:', appState.sharedInsurers);
        console.log('  - 남은 보험사:', appState.selectedInsurers.filter(i => !appState.sharedInsurers.includes(i)));
        
        showToast(`✅ ${insurerName}로 공유되었습니다!`, 'success');
        
        // 7. 모든 보험사 공유 완료시
        if (appState.sharedInsurers.length === appState.selectedInsurers.length) {
            console.log('🎉 모든 보험사 공유 완료!');
            setTimeout(showCompletionModal, 1000);
        }
        
    } catch (err) {
        console.error('❌ 공유 실패!');
        console.error('  - 오류명:', err.name);
        console.error('  - 메시지:', err.message);
        console.error('  - 상세:', err);
        
        showToast('❌ 공유 실패: ' + err.message, 'error');
    }
}
// ============================================
// DB 저장 함수
// ============================================

async function saveRequest(insurerName) {
    console.log('');
    console.log('-'.repeat(50));
    console.log('💾 DB 저장 함수 시작');
    console.log('-'.repeat(50));
    
    // 1. Supabase 연결 확인
    console.log('✓ Supabase 상태 확인');
    console.log('  - supabase:', !!supabase);
    console.log('  - currentPlannerId:', currentPlannerId);
    console.log('  - currentPlannerEmail:', currentPlannerEmail);
    
    if (!supabase || !currentPlannerId) {
        console.error('❌ Supabase 미연결 또는 설계사 ID 없음');
        showToast('❌ Supabase 연결 오류', 'error');
        return;
    }
    
    try {
        // 2. 데이터 준비
        const clientMasked = maskName(appState.formData.clientName);
        
        const requestData = {
            planner_id: currentPlannerId,
            client_name: appState.formData.clientName,
            client_masked: clientMasked,
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
        
        console.log('✓ 저장 데이터 준비 완료');
        console.log('📋 저장할 필드:');
        Object.keys(requestData).forEach(key => {
            let value = requestData[key];
            if (typeof value === 'string' && value.length > 50) {
                value = value.substring(0, 50) + '...';
            }
            console.log(`  - ${key}: ${value}`);
        });
        
        // 3. DB INSERT
        console.log('');
        console.log('🔄 DB INSERT 실행 중...');
        
        const { data, error } = await supabase
            .from('requests')
            .insert([requestData])
            .select();
        
        if (error) {
            console.error('❌ DB INSERT 실패!');
            console.error('  - 코드:', error.code);
            console.error('  - 메시지:', error.message);
            console.error('  - 상세:', error.details);
            showToast(`❌ DB 저장 실패: ${error.message}`, 'error');
            return;
        }
        
        console.log('✅ DB INSERT 성공!');
        console.log('  - 저장된 ID:', data?.[0]?.id);
        console.log('  - 저장된 고객명:', data?.[0]?.client_masked);
        console.log('  - 저장된 보험사:', data?.[0]?.delivered_insurers);
        
        showToast('✅ 의뢰가 마이페이지에 저장되었습니다', 'success');
        
    } catch (err) {
        console.error('❌ DB 저장 중 오류 발생!');
        console.error('  - 오류명:', err.name);
        console.error('  - 메시지:', err.message);
        console.error('  - 상세:', err);
        showToast(`❌ 저장 오류: ${err.message}`, 'error');
    }
    
    console.log('');
}

// 개인정보 마스킹
function maskName(name) {
    if (!name || name.length <= 2) return '**';
    return name.charAt(0) + '*'.repeat(name.length - 1);
}

function showCompletionModal() {
    openModal('completion-modal');
}

function closeCompletionModal() {
    closeModal('completion-modal');
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
    
    document.querySelectorAll('input[name="medical-history"]').forEach(r => r.checked = false);
    document.querySelectorAll('.chip.selected').forEach(c => c.classList.remove('selected'));
    
    appState.selectedProducts = [];
    appState.selectedInsurers = [];
    appState.sharedInsurers = [];
    
    goToStep(1);
}

// ============================================
// 나의 페이지
// ============================================
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
        
        const matchName = (req.client_masked || '').toLowerCase().includes(searchKeyword);
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
        filtered.sort((a, b) => (a.client_masked || '').localeCompare(b.client_masked || ''));
    }
    
    renderRequestList(filtered);
}

function renderRequestList(requests) {
    const container = document.getElementById('request-list');
    
    if (!requests || requests.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: var(--muted);">검색 결과가 없습니다</p>';
        return;
    }
    
    let html = '';
    requests.forEach(req => {
        const date = new Date(req.created_at).toLocaleDateString('ko-KR');
        const preview = req.standard_text_sms.substring(0, 60) + '...';
        const insurerText = req.delivered_insurers?.length > 0 ? `→ ${req.delivered_insurers.join(', ')}` : '';
        html += `<div class="request-item" onclick="openDetailModal('${req.id}')"><div class="request-header"><span class="request-date">${date}</span></div><div class="request-summary">${req.client_masked} ${insurerText}</div><div class="request-summary" style="font-size: 13px; color: var(--muted);">${preview}</div></div>`;
    });
    
    container.innerHTML = html;
}

let currentDetailId = null;

async function openDetailModal(requestId) {
    currentDetailId = requestId;
    if (!supabase) return;
    
    try {
        const { data } = await supabase.from('requests').select('*').eq('id', requestId).single();
        if (!data) return;
        
        const date = new Date(data.created_at).toLocaleString('ko-KR');
        
        let html = `
            <div class="detail-section">
                <span class="detail-section-title">기본 정보</span>
                <div class="detail-info-grid">
                    <div class="detail-info-item">
                        <div class="detail-info-label">작성일시</div>
                        <div class="detail-info-value">${date}</div>
                    </div>
                    <div class="detail-info-item">
                        <div class="detail-info-label">고객명</div>
                        <div class="detail-info-value">${data.client_masked}</div>
                    </div>
                </div>
        `;
        
        if (data.delivered_insurers?.length > 0) {
            html += `
                <div class="detail-info-item" style="grid-column: 1 / -1; margin-top: 8px;">
                    <div class="detail-info-label">전달 보험사</div>
                    <div class="detail-info-value">${data.delivered_insurers.join(', ')}</div>
                </div>
            `;
        }
        
        html += `
            </div>
            <div class="detail-section">
                <div class="detail-text-section">
                    <label class="detail-text-label">📱 카카오톡용 텍스트</label>
                    <div class="detail-text-content">${data.standard_text_kakao}</div>
                </div>
            </div>
            <div class="detail-section">
                <div class="detail-text-section">
                    <label class="detail-text-label">💬 문자용 텍스트</label>
                    <div class="detail-text-content">${data.standard_text_sms}</div>
                </div>
            </div>
            <div class="detail-buttons">
                <button class="detail-btn detail-btn-secondary" onclick="copyDetailText()">📋 복사</button>
                <button class="detail-btn detail-btn-primary" onclick="reshareDetail()">📤 재공유</button>
            </div>
        `;
        
        document.getElementById('detail-content').innerHTML = html;
        openModal('detail-modal');
    } catch (err) {
        console.error('상세 로드 실패:', err);
    }
}

async function copyDetailText() {
    if (!currentDetailId || !supabase) return;
    try {
        const { data } = await supabase.from('requests').select('standard_text_kakao').eq('id', currentDetailId).single();
        if (data) {
            await navigator.clipboard.writeText(data.standard_text_kakao);
            showToast('카카오톡 텍스트가 복사되었습니다', 'success');
        }
    } catch (err) {
        showToast('복사에 실패했습니다', 'error');
    }
}

async function reshareDetail() {
    if (!currentDetailId || !supabase) return;
    try {
        const { data } = await supabase.from('requests').select('standard_text_kakao').eq('id', currentDetailId).single();
        if (data) {
            if (navigator.share) {
                await navigator.share({ title: '설매Talk', text: data.standard_text_kakao });
            } else {
                await navigator.clipboard.writeText(data.standard_text_kakao);
                showToast('클립보드에 복사되었습니다', 'success');
            }
        }
    } catch (err) {
        if (err.name !== 'AbortError') showToast('공유에 실패했습니다', 'error');
    }
}

// ============================================
// 전산정보
// ============================================
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

async function saveAllCredentials(type = 'nonlife') {
    if (!supabase || !currentPlannerId) {
        showToast('로그인이 필요합니다', 'error');
        return;
    }
    
    if (type === 'life') {
        showToast('생명보험은 준비중입니다', 'error');
        return;
    }
    
    const codeInputs = document.querySelectorAll('.credentials-code-input');
    const credentialsToSave = [];
    
    codeInputs.forEach(codeInput => {
        const insurer = codeInput.dataset.insurer;
        const code = codeInput.value.trim();
        if (code) credentialsToSave.push({ 
            planner_id: currentPlannerId, 
            insurer_name: insurer, 
            commission_code: code, 
            type: '손해보험' 
        });
    });
    
    if (credentialsToSave.length === 0) {
        showToast('최소 1개 이상의 위촉코드를 입력해주세요', 'error');
        return;
    }
    
    try {
        for (const credential of credentialsToSave) {
            const { error } = await supabase
                .from('insurer_credentials')
                .upsert(credential, { onConflict: 'planner_id,insurer_name' });
            
            if (!error) {
                insurerCommissionCodes[credential.insurer_name] = credential.commission_code;
                console.log('✅ 저장:', credential.insurer_name);
            }
        }
        
        showToast(`✅ ${credentialsToSave.length}개 위촉코드가 저장되었습니다!`, 'success');
        renderNonlifeCredentialsForm();
    } catch (err) {
        console.error('저장 실패:', err);
        showToast('❌ 저장에 실패했습니다', 'error');
    }
}

// ============================================
// 대시보드
// ============================================
async function loadDashboardData() {
    if (!supabase || !currentPlannerId) {
        showToast('로그인이 필요합니다', 'error');
        return;
    }
    
    const monthInput = document.getElementById('dashboard-month');
    let selectedDate = monthInput.value ? new Date(monthInput.value + '-01') : new Date();
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    
    try {
        const { data: thisMonthData } = await supabase
            .from('requests')
            .select('*')
            .eq('planner_id', currentPlannerId)
            .gte('created_at', `${year}-${month}-01`)
            .lt('created_at', `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01`);
        
        if (!thisMonthData) {
            showToast('데이터를 불러올 수 없습니다', 'error');
            return;
        }
        
        const insurerStats = {};
        const dailyStats = {};
        
        thisMonthData.forEach(req => {
            if (req.delivered_insurers && Array.isArray(req.delivered_insurers)) {
                req.delivered_insurers.forEach(insurer => {
                    insurerStats[insurer] = (insurerStats[insurer] || 0) + 1;
                });
            }
            
            const date = new Date(req.created_at).toISOString().split('T')[0];
            dailyStats[date] = (dailyStats[date] || 0) + 1;
        });
        
        renderSummaryCards(thisMonthData, insurerStats);
        renderPieChart(insurerStats);
        renderLineChart(dailyStats, year, month);
        renderRankingTable(insurerStats);
        
    } catch (err) {
        console.error('대시보드 데이터 로드 실패:', err);
        showToast('데이터 로드 실패', 'error');
    }
}

function renderSummaryCards(data, insurerStats) {
    const total = data.length;
    const topInsurer = Object.entries(insurerStats).sort((a, b) => b[1] - a[1])[0];
    const avgDaily = (total / new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()).toFixed(1);
    
    const html = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 8px;">
            <div style="font-size: 12px; margin-bottom: 4px; opacity: 0.9;">이달 총 의뢰</div>
            <div style="font-size: 28px; font-weight: 700;">${total}건</div>
        </div>
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 16px; border-radius: 8px;">
            <div style="font-size: 12px; margin-bottom: 4px; opacity: 0.9;">일평균</div>
            <div style="font-size: 28px; font-weight: 700;">${avgDaily}건</div>
        </div>
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 16px; border-radius: 8px;">
            <div style="font-size: 12px; margin-bottom: 4px; opacity: 0.9;">주요 보험사</div>
            <div style="font-size: 18px; font-weight: 700;">${topInsurer ? topInsurer[0] : '-'}</div>
            <div style="font-size: 12px; margin-top: 4px; opacity: 0.9;">${topInsurer ? topInsurer[1] + '건' : ''}</div>
        </div>
    `;
    document.getElementById('summary-cards').innerHTML = html;
}

function renderPieChart(insurerStats) {
    const data = Object.entries(insurerStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, value]) => ({
            name,
            value
        }));
    
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#ffd89b', '#19547b', '#ff6b6b', '#ee5a6f'];
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90;
    let pathData = '';
    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    
    data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 360;
        const startAngle = currentAngle * Math.PI / 180;
        const endAngle = (currentAngle + sliceAngle) * Math.PI / 180;
        
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);
        
        const largeArc = sliceAngle > 180 ? 1 : 0;
        
        const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        
        pathData += `<path d="${path}" fill="${colors[index % colors.length]}" stroke="white" stroke-width="2"/>`;
        currentAngle += sliceAngle;
    });
    
    let legend = '<div style="margin-top: 16px;">';
    data.forEach((item, index) => {
        const percent = ((item.value / total) * 100).toFixed(1);
        legend += `<div style="display: flex; align-items: center; margin-bottom: 8px; font-size: 13px;">
            <div style="width: 12px; height: 12px; border-radius: 2px; background: ${colors[index % colors.length]}; margin-right: 8px;"></div>
            <span style="flex: 1;">${item.name}</span>
            <span style="font-weight: 600;">${item.value}건 (${percent}%)</span>
        </div>`;
    });
    legend += '</div>';
    
    const html = `
        <div style="text-align: center;">
            <svg width="200" height="200" viewBox="0 0 200 200" style="margin: 0 auto;">
                ${pathData}
            </svg>
            ${legend}
        </div>
    `;
    
    document.getElementById('pie-chart-container').innerHTML = html;
}

function renderLineChart(dailyStats, year, month) {
    const daysInMonth = new Date(year, parseInt(month), 0).getDate();
    const chartData = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`;
        chartData.push({
            date: day,
            count: dailyStats[dateStr] || 0
        });
    }
    
    const maxCount = Math.max(...chartData.map(d => d.count), 1);
    const chartHeight = 150;
    const chartWidth = 300;
    const pointSpacing = chartWidth / (chartData.length - 1 || 1);
    
    let points = '';
    chartData.forEach((item, index) => {
        const x = index * pointSpacing;
        const y = chartHeight - (item.count / maxCount) * chartHeight;
        points += `${x},${y} `;
    });
    
    let html = `
        <div style="overflow-x: auto;">
            <svg width="${chartWidth}" height="${chartHeight + 40}" viewBox="0 0 ${chartWidth} ${chartHeight + 40}" style="margin-bottom: 16px;">
                <line x1="0" y1="${chartHeight}" x2="${chartWidth}" y2="${chartHeight}" stroke="#e5e7eb" stroke-width="1"/>
                <polyline points="${points}" fill="none" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ${chartData.map((item, index) => {
                    const x = index * pointSpacing;
                    const y = chartHeight - (item.count / maxCount) * chartHeight;
                    return `<circle cx="${x}" cy="${y}" r="3" fill="#667eea"/><text x="${x}" y="${chartHeight + 20}" text-anchor="middle" font-size="11" fill="#6b7280">${Math.ceil((index + 1) / Math.ceil(chartData.length / 4))}</text>`;
                }).join('')}
            </svg>
        </div>
    `;
    
    document.getElementById('line-chart-container').innerHTML = html;
}

function renderRankingTable(insurerStats) {
    const sorted = Object.entries(insurerStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    let html = '';
    sorted.forEach((item, index) => {
        const total = Object.values(insurerStats).reduce((a, b) => a + b, 0);
        const percent = ((item[1] / total) * 100).toFixed(1);
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--line);">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 32px; height: 32px; background: ${['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'][index]}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">${index + 1}</div>
                    <span style="font-weight: 600;">${item[0]}</span>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; font-size: 16px;">${item[1]}건</div>
                    <div style="font-size: 12px; color: var(--muted);">${percent}%</div>
                </div>
            </div>
        `;
    });
    
    document.getElementById('ranking-table').innerHTML = html || '<p style="text-align: center; color: var(--muted); padding: 20px;">데이터가 없습니다</p>';
}

// ============================================
// 유틸리티
// ============================================
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    if (type === 'error') toast.classList.add('error');
    else if (type === 'success') toast.classList.add('success');
    
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function initDraggableModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const header = modal.querySelector('.modal-header');
        if (!header) return;
        
        let isDragging = false;
        let currentX = 0;
        let currentY = 0;
        let initialX = 0;
        let initialY = 0;
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX;
            initialY = e.clientY;
            
            const content = modal.querySelector('.modal-content');
            currentX = content.offsetLeft || 0;
            currentY = content.offsetTop || 0;
            
            content.style.position = 'fixed';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - initialX;
            const deltaY = e.clientY - initialY;
            
            const content = modal.querySelector('.modal-content');
            let newX = currentX + deltaX;
            let newY = currentY + deltaY;
            
            newX = Math.max(0, Math.min(newX, window.innerWidth - content.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - content.offsetHeight));
            
            content.style.left = newX + 'px';
            content.style.top = newY + 'px';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    });
}
</script></body>
</html>
