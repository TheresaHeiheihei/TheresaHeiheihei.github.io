// 处理各个 article 中的文本-----------------------------
const article = document.querySelector('article');

if (article) {
    let article_content = article.innerHTML;

    // 0-1.将“[页眉:...]”生成页眉
    article_content = article_content.replace(/\[页眉: ([^\]]+)\]/, `
        <div style="border-bottom: solid #bbb 1px; margin-bottom: 0.5em;">
            <a href="index.html" style="float: left; text-decoration: none; color: inherit;">返回主目录</a>
            <span style="float: right;">$1</span>
            <div style="clear: both; height: 0;"></div>
        </div>    
    `);

    // 1-1.将以非“1)”为开头的标题直到冒号之前都加粗、并在标题前面和冒号后面添加换行符<br>
    article_content = article_content.replace(/\n\s*([02-9]+\)\s*[^：]+)：/g, '<br><span style="font-family: var(--source-font-bold);">$1</span>：<br>');
    /*
        ()      代表一个分区、可以用 $1 代表被“()”包裹的第一个分区、以此类推
        [02-9]+ 匹配除了1之外的其他一个或多个数字
        \)      匹配右（英文）括号
        \s*     匹配 0 个或多个空白字符
        [^:]+   匹配除了中文冒号之外的一个或多个字符
        :       匹配中文冒号
    */

    // 1-2.将以“1)”为开头的标题直到冒号之前都加粗、并在冒号后面添加换行符<br>
    article_content = article_content.replace(/\n\s*(1\)\s*[^：]+)：/g, '<span style="font-family: var(--source-font-bold);">$1</span>：<br>');

    // 1-3.将被宽字符中括号和半中括号括起来的、需要隐藏的内容替换为带有下划线的“查看答案”、原有内容的［i: ...］搞到后面隐藏的 span 兄弟元素中、原有内容的［b: ...］搞到后面隐藏的 div 元素中
    article_content = article_content.replace(
        /(<br>)?\s*［i:([^］]*)］\s*［b:([^］]*)］/g, 
        "<span class=\"check-answer\">查看描述</span><span class=\"hide\">$2</span><div class=\"hide\">$3</div>"
    );
    article_content = article_content.replace(
        /(<br>)?\s*［qb:([^］]*)］\s*［b:答案:([^］]*)］/g, 
        "<span class=\"check-answer\">查看问题/答案</span><div class=\"hide\">$2</div><div class=\"hide\"><span style=\"font-family: var(--source-font-bold);\">答案</span>：$3</div>"
    );
    article_content = article_content.replace(
        /(<br>)?\s*［qb:([^］]*)］\s*［b:([^］]*)］/g, 
        "<span class=\"check-answer\">查看问题/答案</span><div class=\"hide\">$2</div><div class=\"hide\">$3</div>"
    );
    article_content = article_content.replace(
        /(<br>)?\s*［i:([^］]*)］/g, 
        "<span class=\"check-answer\">查看描述</span><span class=\"hide\">$2</span>"
    );
    article_content = article_content.replace(
        /(<br>)?\s*［b:([^］]*)］/g, 
        "<span class=\"check-answer\">查看描述</span><div class=\"hide\">$2</div>"
    );

    // 1-4.将以带圈数字开头、冒号结尾的标题前面加换行和两个字符的缩进
    article_content = article_content.replace(/(①\s*)([^：]+)：/g, '&emsp;&nbsp;$1<span style="margin-right: 0.15em;"></span>$2：');
    article_content = article_content.replace(/([②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳]+\s*)([^：]+)：/g, '<br>&emsp;&nbsp;$1<span style="margin-right: 0.15em;"></span>$2：');

    // 3-1.将形如```c++的代码块整合到<pre><code></code></pre>中
    article_content = article_content.replace(/```[cC]\+\+\n([^\s][^`]*)```/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="background-color: transparent;">$1</code></pre>');
    article_content = article_content.replace(/```[cC]\+\+\n(    [^\s][^`]*)```/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="margin-left: -2.4em; background-color: transparent;">$1</code></pre>');
    article_content = article_content.replace(/```[cC]\+\+\n(        [^\s][^`]*)```/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="margin-left: -4.7em; background-color: transparent;">$1</code></pre>');
    article_content = article_content.replace(/```[cC]\+\+\n(            [^\s][^`]*)```/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="margin-left: -7.1em; background-color: transparent;">$1</code></pre>');
    article_content = article_content.replace(/```[cC]\+\+\n(                [^\s][^`]*)```/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="margin-left: -9.5em; background-color: transparent;">$1</code></pre>');
    article_content = article_content.replace(/```[cC]\+\+\n(                    [^\s][^`]*)```/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="margin-left: -11.9em; background-color: transparent;">$1</code></pre>');

    // if (/\n\s*<\/code><\/pre>/.test(article_content)) {
    //     let section_element = document.querySelector("section");
    //     section_element.style.backgroundColor = 'yellow';
    // }

    article_content = article_content.replace(/(```[cC][pP][pP])([\s\S]*?)(```)/g, function(match, p1, p2, p3) {
        // p1 是 <xmp> 和 </xmp> 之间的内容
        // 将内容中的 < 替换为 &lt;
        const escaped = p2
            .replace(/=""/g, '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;');
        // 返回重新组装后的字符串
        return `${p1}${escaped}${p3}`;
    });
    article_content = article_content.replace(/```[cC][pP][pP]\n([^\s][^`]*)```/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="background-color: transparent;">$1</code></pre>');
    article_content = article_content.replace(/```[cC][pP][pP]\n(    [^\s][^`]*)```/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="margin-left: -2.4em; background-color: transparent;">$1</code></pre>');
    article_content = article_content.replace(/```[cC][pP][pP]\n(        [^\s][^`]*)```/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="margin-left: -4.7em; background-color: transparent;">$1</code></pre>');
    article_content = article_content.replace(/```[cC][pP][pP]\n(            [^\s][^`]*)```/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="margin-left: -7.1em; background-color: transparent;">$1</code></pre>');
    article_content = article_content.replace(/```[cC][pP][pP]\n(                [^\s][^`]*)```/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="margin-left: -9.5em; background-color: transparent;">$1</code></pre>');
    article_content = article_content.replace(/```[cC][pP][pP]\n(                    [^\s][^`]*)```/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="margin-left: -11.9em; background-color: transparent;">$1</code></pre>');


    // 3-2.将``之间的内容视为行内代码块
    article_content = article_content.replace(/`([^`]+)`/g, '<span class="inline-code">$1</span>');

    // 3-3.将<xmp></xmp>中的内容视为行间代码块（与```c++一样）
    article_content = article_content.replace(/<xmp>([\s\S]*?)<\/xmp>/g, function(match, p1) {
        // p1 是 <xmp> 和 </xmp> 之间的内容
        // 将内容中的 < 替换为 &lt;
        const escaped = p1.replace(/&/g, '&amp;')
            .replace(/<!--[^-]+-->/g, '')
            .replace(/</g, '&lt;');
        // 返回重新组装后的字符串
        return `<xmp>${escaped}</xmp>`;
    });
    /*
        let matches = [...article_content.matchAll(/<xmp[^>]*>([\s\S]*?)<\/xmp>/gi)];
        let contents = matches.map(m => m[1]);
        contents.forEach(content => {
            content.replace('/&/g', '&amp;').replace('/</g', '&lt;');

        });
    */
    article_content = article_content.replace(/<xmp>\n([^\s][^<]*)<\/xmp>/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="background-color: transparent;">$1</code></pre>');
    article_content = article_content.replace(/<xmp>\n(    [^\s][^<]*)<\/xmp>/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="margin-left: -2.4em; background-color: transparent;">$1</code></pre>');
    article_content = article_content.replace(/<xmp>\n(        [^\s][^<]*)<\/xmp>/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="margin-left: -4.7em; background-color: transparent;">$1</code></pre>');
    article_content = article_content.replace(/<xmp>\n(            [^\s][^<]*)<\/xmp>/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="margin-left: -7.1em; background-color: transparent;">$1</code></pre>');
    article_content = article_content.replace(/<xmp>\n(                [^\s][^<]*)<\/xmp>/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="margin-left: -9.5em; background-color: transparent;">$1</code></pre>');
    article_content = article_content.replace(/<xmp>\n(                    [^\s][^<]*)<\/xmp>/g, '<pre class="my-pre-style need-highlight"><code class="language-cpp code-inner-pre" style="margin-left: -11.9em; background-color: transparent;">$1</code></pre>');

    // 3-4.去除代码块最后一行后面的换行符
    article_content = article_content.replace(/(\n\s*)<\/code><\/pre>/g, '</code></pre>');

    // 4-1.将「i: ...」和「b: ...」中的内容（举例说明的内容）变成半透明
    article_content = article_content.replace(/「i:([^」]*)」/g, '<span class="example">$1</span>');
    article_content = article_content.replace(/「b:([^」]*)」/g, '<div class="example">$1</div>');

    // 5.简单文本替换
    // 5-1.将全角右尖括号替换为一个制表符和一个空格的缩进
    article_content = article_content.replace(/＞/g, '&emsp;&nbsp;'); 

    article.innerHTML = article_content;
}

// 处理隐藏内容--------------------------------------------------------
// 选择器
let hide_elements = document.querySelectorAll('.check-answer');

// 记录点击后被隐藏的“查看答案”
let check_answer_stack = [];

// 1. 点击“查看答案”时隐藏“查看答案”提示、显示后面包含答案的所有带有类名 hide 的元素的通用函数
function show_answer(target) {
    if (target.dataset.expanded  === 'true') return;
 
    target.style.display  = 'none';
    target.dataset.expanded  = 'true';
 
    let next = target.nextElementSibling; 
    const revealed = [];
 
    while (next && ['SPAN', 'DIV'].includes(next.tagName)  && next.classList.contains('hide'))  {
        next.classList.remove('hide'); 
        revealed.push(next); 
        next = next.nextElementSibling; 
    }
 
    // 保存本次揭示的元素
    target._revealedElements = revealed;
    check_answer_stack.push(target); 
 
    // 如果最后一个是 div，隐藏其后的 br
    if (revealed.length  > 0 && revealed[revealed.length - 1].tagName === 'DIV' && next?.tagName === 'BR') {
        next.style.display  = 'none';
    }
}

// 2. 点击“查看答案”时显示答案
hide_elements.forEach(element => {
    // 被点击时
    element.addEventListener('click', function(event) {
        show_answer(this);
        // event.preventDefault(); // 阻止默认行为（如表单提交）
    });
});

// 3. 撤销操作 1. 的通用函数
function cancel_show() {
    const target = check_answer_stack.pop(); 
    if (!target) return;
 
    target.style.display  = 'inline';
    delete target.dataset.expanded; 
 
    if (target._revealedElements) {
        target._revealedElements.forEach(el  => {
            el.classList.add('hide'); 
        });
        delete target._revealedElements;
    }
 
    // 恢复 br 显示（如果适用）
    let next = target.nextElementSibling; 
    let lastWasDiv = false;
    while (next && ['SPAN', 'DIV'].includes(next.tagName)  && next.classList.contains('hide'))  {
        if (next.tagName  === 'DIV') lastWasDiv = true;
        next = next.nextElementSibling; 
    }
    if (lastWasDiv && next?.tagName === 'BR') {
        next.style.display  = 'inline';
    }
}

// 4. 键盘按下 x 键时撤销上一次查看答案操作，按下 ESC 时撤销所有查看答案操作，按下波浪线符号时显示所有隐藏的答案
document.addEventListener('keydown', function(event) {
    // 监听用户的 ESC 按键、恢复到展示答案之前的样子
    if (event.key === 'Escape') {
        while (check_answer_stack.length > 0) { 
            cancel_show();
        }
    }
    // 监听用户的 x 按键、撤销上一次查看答案
    else if (event.key === 'x' || event.key === 'X') {
        if (check_answer_stack.length > 0) {
            cancel_show();
        }
    }
    // 监听用户的波浪线按键、显示所有隐藏的答案
    else if (event.code === 'Backquote') {
        while (check_answer_stack.length > 0) { 
            cancel_show();
        }
        document.querySelectorAll(".check-answer").forEach((check_answer) => {
            show_answer(check_answer);
        });
    }
});

// 5. 双击空白位置撤销上一次查看答案、三击撤销所有查看答案操作、四击显示所有隐藏的内容
// 记录累积点击次数
let click_count = 0;

document.addEventListener('click', function(event) {
    // 获取点击的目标元素
    const clicked_element = event.target;
  
    if (!(clicked_element.className === 'check-answer')) {
        // 第一击：若 300ms 后没有第二击，复位 click_count
        if (click_count == 0) {
            click_count = 1;
            setTimeout(() => {
                if (click_count == 1) {
                    click_count = 0;
                }
            }, 300);
        }
        // 第二击：若 300ms 内有第一击、且 300ms 后没第三击，撤销上一次查看答案操作
        else if (click_count == 1) {
            click_count = 2;
            setTimeout(() => {
                if (click_count == 2) {
                    click_count = 0;
                    if (check_answer_stack.length > 0) {
                        cancel_show();
                    }
                }
            }, 300);
        }
        // 第三击：若 300ms 内有第二击、且 300ms 内没有第四击，撤销所有查看答案操作
        else if (click_count == 2) {
            click_count = 3;
            setTimeout(() => {
                if (click_count == 3) {
                    click_count = 0;
                    while (check_answer_stack.length > 0) { 
                        cancel_show();
                    }
                }
            }, 300);
        }
        // 第四击：若 300ms 内有第四击，展开全部隐藏内容（先隐藏全部内容再展开）
        else if (click_count == 3) {
            click_count = 0;

            while (check_answer_stack.length > 0) { 
                cancel_show();
            }

            document.querySelectorAll(".check-answer").forEach((check_answer) => {
                show_answer(check_answer);
            });
        }
    } 
});

// 代码高亮--------------------------------------------
// 1. 定义用于高亮的函数
function highlightAllNeedHighlight() {
            // 这里的选择器更宽松：选择任何 class 包含 need-highlight 的元素内部的 <pre><code> 块
            const codeBlocks = document.querySelectorAll('.need-highlight pre code, .need-highlight code');
            codeBlocks.forEach((block) => {
                // 检查代码块是否已经被高亮过（通过是否存在 hljs 类判断），避免重复高亮
                if (!block.classList.contains('hljs')) {
                    hljs.highlightElement(block);
                }
            });
        }

// 2. 初始高亮
highlightAllNeedHighlight();

// 3. 使用 MutationObserver 监听 DOM 变化（当你动态添加代码块时非常有用）
const observer = new MutationObserver(() => {
    // 当 DOM 变化时，重新执行高亮
    highlightAllNeedHighlight();
});

// 4. 开始监听 document.body 的子树变化
observer.observe(document.body, { childList: true, subtree: true });
