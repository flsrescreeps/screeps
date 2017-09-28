let format = {

    log: function (message, severity = 5) {
        const styles = [
            '#FFFFFF',
            '#00CED1',
            '#32CD32',
            '#FFFF00',
            '#FF8C00',
            '#FF0000',
        ];
        console.log(`<font color="${styles[severity]}">${message}</font>`);
    }
};

module.exports = format;