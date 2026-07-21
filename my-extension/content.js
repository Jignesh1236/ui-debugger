function onOff() {
    if (document.querySelector('*').classList.contains('ui-debugger')) {
        document.querySelector('*').classList.remove('ui-debugger');
    } else {
        document.querySelector('*').classList.add('ui-debugger');
    }
}