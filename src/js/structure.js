/**
 * Created by josephyesselman on 1/30/16.
 */

RNAMAKE.Atom = function(name, coords) {
    var geometry = new THREE.SphereGeometry(4, 64, 64);
    var material = new THREE.MeshBasicMaterial(  {color: 0xff0000, shading: THREE.SmoothShading} );

    this.name = name;
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.position.copy(coords);
    this.obj.castShadow = true;
    this.obj.receiveShadow = true;

    this.coords = function() {
        return this.obj.position;
    }

    this.copy = function() {
        return new RNAMAKE.Atom(this.name, this.coords());
    }
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

RNAMAKE.Residue = function(rtype, name, num, chain_id, i_code) {
    this.rtype    = rtype;
    this.name     = name;
    this.num      = num;
    this.chain_id = chain_id;
    this.i_code   = i_code;
    if(this.i_code == undefined) {  this.i_code = ""; }
    this.atoms = [];

    this.setup_atoms = function(atoms) {
        for(var i in atoms) {
            //var name_change
            if(this.rtype.atom_map.hasOwnProperty(atoms[i].name)) {
                var pos = this.rtype.atom_map[atoms[i].name];
            }
        }
    };
};

RNAMAKE.str_to_atom = function(s) {
    var spl = s.split(" ");
    var coords = new THREE.Vector3(spl[1], spl[2], spl[3]);
    return new RNAMAKE.Atom(spl[0], coords);
}

RNAMAKE.str_to_res = function(s) {
    var spl = s.split(",");
    var rtype = RNAMAKE.residue_type_set.get_rtype_by_resname(spl[0]);
    var r = new RNAMAKE.Residue(rtype, spl[1], spl[2], spl[3], spl[4]);
    var atoms = [];

    for(var i = 5; i < spl.length-1; i++) {
        var a = RNAMAKE.str_to_atom(spl[i]);
        atoms.push(a);
    }
    r.setup_atoms(atoms);

    return r;
};



