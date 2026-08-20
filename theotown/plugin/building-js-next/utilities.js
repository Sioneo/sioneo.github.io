class Utils {
    static randomId(mode = "full") {
        let reuslt;
        switch(mode) {
            case "short":
                result = crypto.randomUUID().slice()
            case "full":
            default:
                result = crypto.randomUUID(0, 7);
        }
        return "$" + result;
    }
}
