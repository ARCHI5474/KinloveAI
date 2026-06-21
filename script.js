alert("最新版が読み込まれました！01");

async function sendMessage() {

    const input = document.getElementById("message");
    const msg = input.value;

    if (!msg.trim()) {
        return;
    }

    const chat = document.getElementById("chat");

    input.value = "";

    chat.innerHTML += `
    <div id="loading" class="ai">
        <div class="bubble">
            ⏳ 考え中...
        </div>
    </div>
    `;

    chat.innerHTML += `
    <div class="user">
        <div class="bubble">
            ${msg}
        </div>
    </div>
    `;

    try {

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `
あなたはKinloveAIです。

ルール:
・必ず日本語で回答
・Markdownを使わない
・簡潔に回答
・敬語を使わない
・柔らかい物腰で会話する
・正確性を最優先する
・不明なことには正直に「わからない」と答える
・自信が低い場合はその旨を伝える
・推測に対してはその旨を伝える
・未確認情報を断定しない
・難しい専門用語は使わない
・ユーザーの文章量によって返答する文章量を調整する

ユーザー:
${msg}
`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error?.message || `HTTP ${response.status}`
            );
        }

        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
            throw new Error("AIの応答が取得できませんでした");
        }

        document.getElementById("loading")?.remove();

        chat.innerHTML += `
        <div class="ai">
            <div class="bubble">
                ${reply}
            </div>
        </div>
        `;

        chat.scrollTop = chat.scrollHeight;

    } catch (error) {

        console.error(error);

        document.getElementById("loading")?.remove();

        chat.innerHTML += `
        <div class="ai">
            <div class="bubble">
                エラー: ${error.message}
            </div>
        </div>
        `;
    }
}

document.getElementById("message").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
