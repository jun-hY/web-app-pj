// 히스토리 아이템 삭제 함수
async function deleteHistoryItem(itemId) {
    const historyItem = document.querySelector(`[data-id="${itemId}"]`)
    if (historyItem) {
        // 삭제 확인
        if (confirm("이 히스토리 항목을 삭제하시겠습니까?")) {
            try {
                const res = await fetch(`http://localhost:5000/deleteReview?id=${itemId}`, {
                    method: 'delete'
                })
                if (!res.ok) {
                    return
                }
                historyItem.remove()
                saveHistoryToStorage()
                location.href = 'http://localhost:5000/';
            } catch (err) {
                console.error(err);
            }
        }
    }
}

// 로컬 스토리지에 히스토리 저장
function saveHistoryToStorage() {
    const historyItems = []
    document.querySelectorAll(".history-item").forEach((item) => {
        const id = item.dataset.id
        const timestamp = item.querySelector(".history-item-meta span").textContent
        const snippet = item.querySelector(".history-item-snippet").textContent
        const scoreText = item.querySelector(".history-item-score").textContent
        const score = Number.parseInt(scoreText.replace("점수: ", ""))

        historyItems.push({
            id,
            timestamp,
            snippet,
            score,
        })
    })

    localStorage.setItem("codeReviewHistory", JSON.stringify(historyItems))
}

document.addEventListener("DOMContentLoaded", () => {
    // 페이지 로드 시 저장된 히스토리 불러오기
    loadHistoryFromStorage()

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
    const loadingIndicator = document.getElementById("loading-indicator")
    const reviewResult = document.getElementById("review-result")

    // hljs 변수 선언 (hljs 라이브러리가 로드되었다고 가정)
    const hljs = window.hljs

    reviewBtn.addEventListener("click", async () => {
        loadingIndicator.children[1].innerText = 'AI가 코드를 분석 중입니다...'
        const code = codeInput.value.trim()
        if (!code) {
            alert("코드를 입력해주세요.")
            return
        }
        // 로딩 표시
        loadingIndicator.style.display = "flex"
        reviewResult.style.opacity = "0.5"

        try {
            const res = await fetch('http://localhost:5000//', {
                method: 'POST', // HTTP 메서드
                headers: {
                    'Content-Type': 'application/json' // 요청 본문 타입
                },
                body: JSON.stringify({
                    code: code,
                })
            });

            const data = await res.json();
            const reviewData = parseReview(await data);
            displayReviewResults(reviewData);
            addToHistory({
                id: reviewData.id,
                timestamp: reviewData.date,
                snippet: code.substring(0, 50) + (code.length > 50 ? "..." : ""),
                score: reviewData.overallScore,
            });

            // 기존 active 클래스 제거
            document.querySelectorAll(".history-item").forEach((item) => {
                item.classList.remove("active")
            })
            // 현재 아이템에 active 클래스 추가
            document.querySelector(`[data-id="${reviewData.id}"]`).classList.add("active");
        } catch (err) {
            console.error(err)
        } finally {
            // 로딩 제거
            loadingIndicator.style.display = "none";
            reviewResult.style.opacity = "1";
        }
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
    function addToHistory(item) {
        const historyList = document.getElementById("history-list")
        const historyItem = document.createElement("div")
        historyItem.className = "history-item"
        historyItem.dataset.id = item.id

        historyItem.innerHTML = `
    <div class="history-item-header">
      <div class="history-item-meta">
        <span>${item.timestamp}</span>
      </div>
        <div class="history-item-actions">
          <button class="delete-btn" onclick="deleteHistoryItem('${item.id}')" title="삭제">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
    </div>
    <div class="history-item-snippet">${item.snippet}</div>
    <div class="history-item-score">점수: ${item.score}</div>
  `

        // 히스토리 아이템 클릭 이벤트 (삭제 버튼 제외)
        historyItem.addEventListener("click", async function (e) {
            if (!e.target.closest(".delete-btn")) {
                // 기존 active 클래스 제거
                document.querySelectorAll(".history-item").forEach((item) => {
                    item.classList.remove("active")
                })
                // 현재 아이템에 active 클래스 추가
                this.classList.add("active")

                // 로딩 표시
                loadingIndicator.children[1].innerText = '불러오는 중입니다...'
                loadingIndicator.style.display = "flex"
                reviewResult.style.opacity = "0.5"

                try {
                    const res = await fetch(`http://localhost:5000//getReview?id=${this.dataset.id}`, {
                        method: 'GET', // HTTP 메서드
                        headers: {
                            'Content-Type': 'application/json' // 요청 본문 타입
                        }
                    });

                    const data = await res.json();
                    const reviewData = parseReview(data);
                    codeInput.value = data.origin_code;
                    displayReviewResults(reviewData);
                } catch (err) {
                    console.error(err);
                } finally {
                    // 로딩 제거
                    loadingIndicator.children[1].innerText = ''
                    loadingIndicator.style.display = "none";
                    reviewResult.style.opacity = "1";
                }

            }
        })

        historyList.prepend(historyItem)

        // 로컬 스토리지에 히스토리 저장
        saveHistoryToStorage()
    }

    // 로컬 스토리지에서 히스토리 불러오기
    function loadHistoryFromStorage() {
        const savedHistory = localStorage.getItem("codeReviewHistory")
        if (savedHistory) {
            const historyItems = JSON.parse(savedHistory)
            historyItems.forEach((item) => {
                addToHistory(item)
            })
        }
    }

    // 새 리뷰 버튼
    const newReviewBtn = document.getElementById("new-review-btn")
    newReviewBtn.addEventListener("click", () => {
        // 기존 active 클래스 제거
        document.querySelector(".history-item.active").classList.remove("active");

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

    function parseReview(data) {
        const scores = JSON.parse(data.scores)
        return {
            id: data.id,
            date: data.date,
            overallScore: scores.total,
            performanceScore: scores.performance,
            securityScore: scores.security,
            readabilityScore: scores.readability,
            summary: data.summary,
            issues: JSON.parse(data.issues),
            suggestions: JSON.parse(data.improvements),
            improvedCode: data.improved_code,
        }
    }
})
