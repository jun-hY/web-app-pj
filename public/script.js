document.addEventListener("DOMContentLoaded", () => {
  // 테마 토글 기능
  const themeToggleBtn = document.getElementById("theme-toggle-btn")
  const body = document.body

  // 저장된 테마 불러오기
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark") {
    body.classList.add("dark-theme")
    updateThemeIcon(true)
  }

  themeToggleBtn.addEventListener("click", () => {
    const isDarkMode = body.classList.toggle("dark-theme")
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
    updateThemeIcon(isDarkMode)
  })

  function updateThemeIcon(isDarkMode) {
    themeToggleBtn.innerHTML = isDarkMode
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>'
  }

  // 탭 전환 기능
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabPanes = document.querySelectorAll(".tab-pane")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab")

      // 모든 탭 버튼에서 active 클래스 제거
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      // 현재 클릭된 버튼에 active 클래스 추가
      this.classList.add("active")

      // 모든 탭 패널 숨기기
      tabPanes.forEach((pane) => pane.classList.remove("active"))
      // 선택된 탭 패널 표시
      document.getElementById(`${tabName}-tab`).classList.add("active")
    })
  })

  // 코드 리뷰 요청 기능
  const reviewBtn = document.getElementById("review-btn")
  const codeInput = document.getElementById("code-input")
  const languageSelect = document.getElementById("language-select")
  const loadingIndicator = document.getElementById("loading-indicator")
  const reviewResult = document.getElementById("review-result")

  // hljs 변수 선언 (hljs 라이브러리가 로드되었다고 가정)
  const hljs = window.hljs

  reviewBtn.addEventListener("click", () => {
    const code = codeInput.value.trim()
    console.log(code)
    if (!code) {
      alert("코드를 입력해주세요.")
      return
    }
    
    fetch('http://localhost:8080/', {
        method: 'POST', // HTTP 메서드
        headers: {
          'Content-Type': 'application/json' // 요청 본문 타입
        },
        'body': JSON.stringify({
          code: code,
        })
    })


    // 로딩 표시
    loadingIndicator.style.display = "flex"
    reviewResult.style.opacity = "0.5"

    // 실제 API 호출 대신 목업 데이터로 대체 (실제 구현 시 이 부분을 API 호출로 변경)
    setTimeout(() => {
      // 목업 데이터
      const mockReviewData = {
        overallScore: 85,
        performanceScore: 78,
        securityScore: 92,
        readabilityScore: 88,
        summary:
          "코드는 전반적으로 잘 작성되었으나, 몇 가지 성능 최적화가 필요합니다. 보안 측면에서는 양호하며, 가독성도 좋은 편입니다.",
        issues: [
          "중첩 루프로 인한 O(n²) 시간 복잡도 문제가 있습니다.",
          "변수 선언이 중복되어 메모리 사용이 비효율적입니다.",
          "에러 처리가 불충분합니다.",
        ],
        suggestions: [
          "중첩 루프 대신 Map 자료구조를 사용하여 시간 복잡도를 O(n)으로 개선하세요.",
          "변수 선언을 함수 스코프 상단으로 이동하여 중복을 제거하세요.",
          "try-catch 블록을 사용하여 예외 상황을 적절히 처리하세요.",
          "주석을 추가하여 복잡한 로직을 설명하세요.",
        ],
        improvedCode: `// 개선된 코드 예시
function findDuplicates(array) {
  // Map을 사용하여 O(n) 시간 복잡도로 개선
  const seen = new Map();
  const duplicates = [];
  
  try {
    // 배열을 한 번만 순회
    for (const item of array) {
      if (seen.has(item)) {
        duplicates.push(item);
      } else {
        seen.set(item, true);
      }
    }
    return duplicates;
  } catch (error) {
    console.error('오류 발생:', error);
    return [];
  }
}`,
      }

      // 결과 표시
      displayReviewResults(mockReviewData)

      // 로딩 표시 제거
      loadingIndicator.style.display = "none"
      reviewResult.style.opacity = "1"

      // 히스토리에 추가
      addToHistory({
        id: Date.now(),
        language: languageSelect.value,
        timestamp: new Date().toLocaleString(),
        snippet: code.substring(0, 50) + (code.length > 50 ? "..." : ""),
        score: mockReviewData.overallScore,
      })
    }, 2000) // 2초 후 결과 표시 (실제 API 호출 시간 시뮬레이션)
  })

  // 리뷰 결과 표시 함수
  function displayReviewResults(data) {
    // 점수 업데이트
    const scoreElements = document.querySelectorAll(".score")
    scoreElements[0].textContent = data.overallScore
    scoreElements[1].textContent = data.performanceScore
    scoreElements[2].textContent = data.securityScore
    scoreElements[3].textContent = data.readabilityScore

    // 요약 탭 업데이트
    document.getElementById("summary-tab").innerHTML = `<p>${data.summary}</p>`

    // 문제점 탭 업데이트
    const issuesListEl = document.querySelector("#issues-tab .issues-list")
    issuesListEl.innerHTML = ""
    data.issues.forEach((issue) => {
      const li = document.createElement("li")
      li.textContent = issue
      issuesListEl.appendChild(li)
    })

    // 제안 탭 업데이트
    const suggestionsListEl = document.querySelector("#suggestions-tab .suggestions-list")
    suggestionsListEl.innerHTML = ""
    data.suggestions.forEach((suggestion) => {
      const li = document.createElement("li")
      li.textContent = suggestion
      suggestionsListEl.appendChild(li)
    })

    // 개선된 코드 탭 업데이트
    const improvedCodeEl = document.querySelector("#improved-code-tab code")
    improvedCodeEl.textContent = data.improvedCode
    hljs.highlightElement(improvedCodeEl)
  }

  // 히스토리에 추가하는 함수
  // 로컬 스토리지 저장 기능 추가 예정
  function addToHistory(item) {
    const historyList = document.getElementById("history-list")
    const historyItem = document.createElement("div")
    historyItem.className = "history-item"
    historyItem.dataset.id = item.id

    historyItem.innerHTML = `
      <div class="history-item-header">
        <strong>${item.language}</strong>
        <span>${item.timestamp}</span>
      </div>
      <div class="history-item-snippet">${item.snippet}</div>
      <div class="history-item-score">점수: ${item.score}</div>
    `

    historyList.prepend(historyItem)
  }

  // 새 리뷰 버튼
  const newReviewBtn = document.getElementById("new-review-btn")
  newReviewBtn.addEventListener("click", () => {
    // 입력 필드 초기화
    codeInput.value = ""

    // 결과 영역 초기화
    const scoreElements = document.querySelectorAll(".score")
    scoreElements.forEach((el) => (el.textContent = "-"))

    document.getElementById("summary-tab").innerHTML = "<p>코드 리뷰 요청 후 결과가 여기에 표시됩니다.</p>"
    document.querySelector("#issues-tab .issues-list").innerHTML = ""
    document.querySelector("#suggestions-tab .suggestions-list").innerHTML = ""
    document.querySelector("#improved-code-tab code").textContent = "// 개선된 코드가 여기에 표시됩니다"

    // 첫 번째 탭 활성화
    document.querySelector(".tab-btn").click()

    // 코드 입력 영역으로 스크롤
    codeInput.scrollIntoView({ behavior: "smooth" })
  })

  // 결과 복사 버튼
  const copyResultBtn = document.getElementById("copy-result-btn")
  copyResultBtn.addEventListener("click", () => {
    const activeTab = document.querySelector(".tab-pane.active")
    const textToCopy = activeTab.textContent

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("결과가 클립보드에 복사되었습니다.")
      })
      .catch((err) => {
        console.error("복사 실패:", err)
        alert("복사에 실패했습니다.")
      })
  })

  // 결과 저장 버튼
  const saveResultBtn = document.getElementById("save-result-btn")
  saveResultBtn.addEventListener("click", () => {
    const activeTab = document.querySelector(".tab-pane.active")
    const textToSave = activeTab.textContent
    const language = languageSelect.value
    const date = new Date().toISOString().slice(0, 10)

    // 텍스트 파일로 저장
    const blob = new Blob([textToSave], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code-review-${language}-${date}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  })
})

