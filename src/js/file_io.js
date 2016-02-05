/**
 * Created by josephyesselman on 1/30/16.
 */

RNAMAKE.FileReaderXML = function() {
    this.data = { text : "" };

    this.read_file_xml = function(file, data) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    data.text = rawFile.responseText;
                }
            }
        };
        rawFile.send(null);
    };

    this.read_file = function(file) {
        this.read_file_xml(file, this.data);
        return this.data.text.split("\n");
    };
};
