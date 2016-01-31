/**
 * Created by josephyesselman on 1/30/16.
 */

RNAMAKE.Atom = function(name, coords) {
    var geometry = new THREE.SphereGeometry(4, 64, 64);
    var material = new THREE.MeshBasicMaterial(  {color: 0xff0000, shading: THREE.SmoothShading} );

    this.obj = new THREE.Mesh(geometry, material);
    this.obj.position.x = coords[0];
    this.obj.position.y = coords[1];
    this.obj.position.z = coords[2];
    this.obj.castShadow = true;
    this.obj.receiveShadow = true;
    this.name = name;

};

RNAMAKE.ResidueType = function(name, atom_map) {
    this.atom_map = atom_map;
    this.name = name;
    this.alt_names = [name[0], "r"+name[0], "D"+name[0]];
};

RNAMAKE.ResidueTypeSet = function() {
    var path = RNAMAKE.PATH + "/resources/residue_types/";
    var rtype_names = ["ADE", "CYT", "GUA", "URA"];
    var reader = new RNAMAKE.FileReaderXML();
    this.residue_types = [];

    for(var i in rtype_names) {
        var lines = reader.read_file(path + rtype_names[i] + ".rtype");
        var atom_names = lines[0].split(" ");
        var atom_map = {};
        for (var j in atom_names) {
            atom_map[atom_names[j]] = j;
        }
        this.residue_types.push(new RNAMAKE.ResidueType(rtype_names[i], atom_map));
    };

    this.get_rtype_by_resname = function(resname) {
        for(var i in this.residue_types) {
            if(resname == this.residue_types[i].name) {
                return this.residue_types[i];
            }
            for(var j in this.residue_types[i].alt_names) {
                if(resname == this.residue_types[i].alt_names[j]) {
                    return this.residue_types[i];
                }
            }
        }
        return null;
    };

};

//create a singleton so there is just this one
RNAMAKE.residue_type_set = new RNAMAKE.ResidueTypeSet();



