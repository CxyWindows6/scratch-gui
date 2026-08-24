import twTranslations from './generated-translations.json';

const LOCAL_OVERRIDES = {
    'zh-cn': {
        'tw.menuBar.menuBarAlignment': '菜单栏对齐',
        'tw.menuBar.alignLeft': '左对齐',
        'tw.menuBar.alignCenter': '居中',
        'tw.menuBar.alignRight': '右对齐',
        'tw.menuBar.guiTheme': '主题',
        'tw.guiTheme.light': '亮色',
        'tw.guiTheme.dark': '暗色',
        'tw.guiTheme.midnight': '午夜',
        'tw.guiTheme.ember': '傍晚',
        'tw.accent.red': '红色',
        'tw.accent.orange': '橙色',
        'tw.accent.purple': '紫色',
        'tw.accent.blue': '蓝色',
        'tw.accent.rainbow': '彩虹',
        'surge.feedbackModal.title': '{APP_NAME} 反馈',
        'surge.feedbackModal.titleLabel': '标题',
        'surge.feedbackModal.titlePlaceholder': '简要概括你的反馈',
        'surge.feedbackModal.kindLabel': '类型',
        'surge.feedbackModal.kindBug': 'Bug 报告',
        'surge.feedbackModal.kindFeature': '功能建议',
        'surge.feedbackModal.kindTranslation': '翻译问题',
        'surge.feedbackModal.kindOther': '其他',
        'surge.feedbackModal.usernameLabel': '用户名',
        'surge.feedbackModal.usernamePlaceholder': '你的名字或昵称',
        'surge.feedbackModal.contentLabel': '详情',
        'surge.feedbackModal.contentPlaceholder':
            '请详细描述你的反馈，支持 Markdown。\n\n' +
            '如果是 Bug 报告，请包含：\n1. 复现步骤\n2. 期望行为\n3. 实际行为',
        'surge.feedbackModal.screenshotLabel': '截图（可选）',
        'surge.feedbackModal.chooseFile': '选择图片',
        'surge.feedbackModal.remove': '删除',
        'surge.feedbackModal.submit': '提交反馈',
        'surge.feedbackModal.submitting': '提交中…',
        'surge.feedbackModal.errorEmptyTitle': '请填写所有必填项。',
        'surge.feedbackModal.successMessage': '感谢！你的反馈已提交。',
        'surge.feedbackModal.viewCommunity': '查看社区反馈',
        'surge.feedbackModal.usernameCooldownError': '用户名每 {days} 天才可修改一次。上次修改距今 {daysAgo} 天。',
        'surge.communityFeedback.button': '社区',
        'surge.communityFeedback.title': '社区反馈',
        'surge.communityFeedback.close': '关闭',
        'surge.communityFeedback.loading': '正在加载反馈…',
        'surge.communityFeedback.empty': '暂无反馈，来做第一个吧！',
        'surge.communityFeedback.previous': '上一页',
        'surge.communityFeedback.next': '下一页',
        'surge.communityFeedback.kindBug': 'Bug',
        'surge.communityFeedback.kindFeature': '功能',
        'surge.communityFeedback.kindTranslation': '翻译',
        'surge.communityFeedback.kindOther': '其他',
        'surge.communityFeedback.comments': '评论',
        'surge.communityFeedback.commentPlaceholder': '写下评论…',
        'surge.communityFeedback.postComment': '发表',
        'surge.communityFeedback.noComments': '暂无评论。',
        'surge.communityFeedback.commentLoading': '加载评论中…',
        'tw.home.description':
            '{APP_NAME} 是一款可以将作品编译成 JavaScript，使其运行速度快如闪电的 Scratch 的修改版。不妨在上面输入一个作品网页链接。',
        'tw.input.tooltip': '在这里粘贴任何作品的 ID',
        'tw.twExtension.name': 'TurboWarp 积木',
        'tw.extensionGallery.name': 'TurboWarp 扩展库',
        'tw.settingsModal.fps': '60 FPS (自定义帧率)',
        'tw.settingsModal.fpsHelp':
            '每秒运行脚本更多次，而不是 30 次。启用此选项后，大多数作品将无法正常工作。如果是这种情况，您应该尝试在禁用自定义帧率模式的情况下使用补帧。{customFramerate}。',
        'tw.settingsModal.fpsHelp.customFramerate': '点击使用 30 或 60 以外的帧率',
        'tw.settingsModal.opf': '每帧更多执行次数 (自定义 OPF)',
        'tw.settingsModal.opfHelp':
            '在一帧内运行更多次脚本。启用 TurboMode 效果更佳。{customOpsPerFrame}。',
        'tw.settingsModal.opfHelp.customOpsPerFrame': '点击使用 1 或 2 以外的 OPF 值'
    },
    'zh-tw': {
        'tw.menuBar.menuBarAlignment': '選單列對齊',
        'tw.menuBar.alignLeft': '靠左對齊',
        'tw.menuBar.alignCenter': '置中對齊',
        'tw.menuBar.alignRight': '靠右對齊',
        'tw.menuBar.guiTheme': '主題',
        'tw.guiTheme.light': '亮色',
        'tw.guiTheme.dark': '暗色',
        'tw.guiTheme.midnight': '午夜',
        'tw.guiTheme.ember': '傍晚',
        'tw.accent.red': '紅色',
        'tw.accent.orange': '橙色',
        'tw.accent.purple': '紫色',
        'tw.accent.blue': '藍色',
        'tw.accent.rainbow': '彩虹',
        'surge.feedbackModal.title': '{APP_NAME} 回饋',
        'surge.feedbackModal.titleLabel': '標題',
        'surge.feedbackModal.titlePlaceholder': '簡要概括你的回饋',
        'surge.feedbackModal.kindLabel': '類型',
        'surge.feedbackModal.kindBug': 'Bug 回報',
        'surge.feedbackModal.kindFeature': '功能建議',
        'surge.feedbackModal.kindTranslation': '翻譯問題',
        'surge.feedbackModal.kindOther': '其他',
        'surge.feedbackModal.usernameLabel': '使用者名稱',
        'surge.feedbackModal.usernamePlaceholder': '你的名字或暱稱',
        'surge.feedbackModal.contentLabel': '詳情',
        'surge.feedbackModal.contentPlaceholder':
            '請詳細描述你的回饋，支援 Markdown。\n\n' +
            '如果是 Bug 回報，請包含：\n1. 重現步驟\n2. 期望行為\n3. 實際行為',
        'surge.feedbackModal.screenshotLabel': '截圖（可選）',
        'surge.feedbackModal.chooseFile': '選擇圖片',
        'surge.feedbackModal.remove': '刪除',
        'surge.feedbackModal.submit': '提交回饋',
        'surge.feedbackModal.submitting': '提交中…',
        'surge.feedbackModal.errorEmptyTitle': '請填寫所有必填項。',
        'surge.feedbackModal.successMessage': '感謝！你的回饋已提交。',
        'surge.feedbackModal.viewCommunity': '查看社群回饋',
        'surge.feedbackModal.usernameCooldownError': '使用者名稱每 {days} 天才可修改一次。上次修改距今 {daysAgo} 天。',
        'surge.communityFeedback.button': '社群',
        'surge.communityFeedback.title': '社群回饋',
        'surge.communityFeedback.close': '關閉',
        'surge.communityFeedback.loading': '正在載入回饋…',
        'surge.communityFeedback.empty': '暫無回饋，快來成為第一個！',
        'surge.communityFeedback.previous': '上一頁',
        'surge.communityFeedback.next': '下一頁',
        'surge.communityFeedback.kindBug': 'Bug',
        'surge.communityFeedback.kindFeature': '功能',
        'surge.communityFeedback.kindTranslation': '翻譯',
        'surge.communityFeedback.kindOther': '其他',
        'surge.communityFeedback.comments': '留言',
        'surge.communityFeedback.commentPlaceholder': '寫下留言…',
        'surge.communityFeedback.postComment': '發表',
        'surge.communityFeedback.noComments': '暫無留言。',
        'surge.communityFeedback.commentLoading': '載入留言中…',
        'tw.home.description':
            '{APP_NAME} 是一款可以將作品編譯成 JavaScript，使其執行速度快如閃電的 Scratch 修改版。不妨在上面輸入一個作品網頁連結。',
        'tw.input.tooltip': '在這裡貼上任何作品的 ID',
        'tw.twExtension.name': 'TurboWarp 積木',
        'tw.extensionGallery.name': 'TurboWarp 擴充庫',
        'tw.settingsModal.fps': '60 FPS (自訂幀率)',
        'tw.settingsModal.fpsHelp':
            '每秒執行腳本更多次，而不是 30 次。啟用此選項後，大多數作品將無法正常運作。如果是這種情況，您應該嘗試在停用自訂幀率模式的情況下使用補幀。{customFramerate}。',
        'tw.settingsModal.fpsHelp.customFramerate': '點擊使用 30 或 60 以外的幀率',
        'tw.settingsModal.opf': '每幀更多執行次數 (自訂 OPF)',
        'tw.settingsModal.opfHelp':
            '在一幀內執行更多次腳本。啟用 TurboMode 效果更佳。{customOpsPerFrame}。',
        'tw.settingsModal.opfHelp.customOpsPerFrame': '點擊使用 1 或 2 以外的 OPF 值'
    }
};

const addAdditionalTranslations = editorMessages => {
    for (const locale of Object.keys(editorMessages)) {
        const toMixIn = twTranslations[locale.toLowerCase()];
        if (toMixIn) {
            Object.assign(editorMessages[locale], toMixIn);
        }
    }

    // We reuse our `es` translations for `es-419` instead of maintaining separate translations.
    if (editorMessages['es-419']) {
        Object.assign(editorMessages['es-419'], twTranslations.es);
    }

    // Local overrides for translations not yet pushed to Transifex
    for (const [locale, overrides] of Object.entries(LOCAL_OVERRIDES)) {
        if (editorMessages[locale]) {
            Object.assign(editorMessages[locale], overrides);
        }
    }
};

export default addAdditionalTranslations;
