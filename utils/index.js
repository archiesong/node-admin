module.exports = {
    salt: () => {
        var time = Date.now() % 100, str = '';
        time = time === 0 ? '00' : String(time);
        for (let i = 0; i < 8; i++) {
            const base = Math.random() < 0.5 ? 65 : 97;
            str += String.fromCharCode(
                base +
                Math.floor(
                    Math.random() * 26
                )
            );
        }
        return time + str;
    }
}