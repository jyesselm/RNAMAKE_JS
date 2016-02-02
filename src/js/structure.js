/**
 * Created by josephyesselman on 1/30/16.
 */

RNAMAKE.DrawMode = {
    STICKS: 0
};

RNAMAKE.Atom = function(name, coords, color) {
    if(color == undefined) { color = 'red'; }

    this.draw_mode = 0;
    this.drawn = 0;
    this.coords = coords;
    this.color = color
    this.name = name;
    this.obj = null;

    this.copy = function() {
        return new RNAMAKE.Atom(this.name, this.coords);
    };

    this.draw = function(scene, draw_mode) {
        this.draw_mode = draw_mode;
        if(this.draw_mode == RNAMAKE.DrawMode.STICKS) {
            var geometry = new THREE.SphereGeometry(0.25, 64, 64);
            var material = new THREE.MeshBasicMaterial(  {color: this.color, shading: THREE.SmoothShading} );
            this.obj = new THREE.Mesh(geometry, material);
            this.obj.position.copy(this.coords);
            this.obj.castShadow = true;
            this.obj.receiveShadow = true;
            scene.add(this.obj);
        }
    };

    this.draw_object = function(draw_mode) {
        if(this.draw_mode == draw_mode && this.drawn) { return; }
        if(this.draw_mode == RNAMAKE.DrawMode.STICKS) {
            var geometry = new THREE.SphereGeometry(0.25, 4, 4);
            //var material = new THREE.MeshBasicMaterial(  {color: this.color, shading: THREE.SmoothShading} );
            for (var i = 0; i < geometry.faces.length; i++) {
                face = geometry.faces[i];
                face.color.set(this.color);
            }
            var obj = new THREE.Mesh(geometry);
            obj.position.copy(this.coords);
            obj.castShadow = true;
            obj.receiveShadow = true;
            return obj;

        }
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
    this.bonds = [];
    this.bond_color = 'gray';

    this.center = function() {
        var center = new THREE.Vector3();
        for(var i in this.atoms) {
            center.add(this.atoms[i].coords);
        }
        center.divideScalar(this.atoms.length);
        return center;
    }

    this.setup_atoms = function(atoms) {
        for(var i in atoms) {
            this.atoms.push(null);
        }

        for(i in atoms) {
            //var name_change
            if(this.rtype.atom_map.hasOwnProperty(atoms[i].name)) {
                var pos = this.rtype.atom_map[atoms[i].name];
                this.atoms[pos] = atoms[i];
                if(this.atoms[pos].name[0] == "N") {
                    this.atoms[pos].color = 'blue';
                }
                if(this.atoms[pos].name[0] == "C") {
                    this.atoms[pos].color = 'gray';
                }
                if(this.atoms[pos].name[0] == "P") {
                    this.atoms[pos].color = 'orange';
                }
                if(this.atoms[pos].name[0] == "O") {
                    this.atoms[pos].color = 'red';
                }
            }

        }
    };

    this.draw = function(geo, draw_mode) {
        this.draw_mode = draw_mode;
        if(this.draw_mode == RNAMAKE.DrawMode.STICKS) {
            for(var i in this.atoms) {
                if(this.atoms[i] == null) { return true; }
                var obj = this.atoms[i].draw_object(draw_mode);
                obj.updateMatrix();
                geo.merge(obj.geometry, obj.matrix);
            }
            this.draw_bonds(geo);
        }
    }

    this.draw_bonds = function(geo) {
        this.draw_bond(0, 1, geo);
        this.draw_bond(0, 2, geo);
        this.draw_bond(0, 3, geo);
        this.draw_bond(3, 4, geo);
        this.draw_bond(4, 5, geo);
        this.draw_bond(5, 6, geo);
        this.draw_bond(5, 7, geo);
        this.draw_bond(5, 7, geo);
        this.draw_bond(7, 8, geo);
        this.draw_bond(6, 9, geo);
        this.draw_bond(7, 10, geo);
        this.draw_bond(9, 10, geo);
        this.draw_bond(10, 11, geo);

        if(this.name == "G") {
            this.draw_bond(12, 13, geo);
            this.draw_bond(13, 14, geo);
            this.draw_bond(13, 15, geo);
            this.draw_bond(15, 16, geo);
            this.draw_bond(16, 17, geo);
            this.draw_bond(17, 18, geo);
            this.draw_bond(18, 19, geo);
            this.draw_bond(17, 20, geo);
            this.draw_bond(20, 21, geo);
            this.draw_bond(21, 22, geo);
            this.draw_bond(22, 9, geo);
            this.draw_bond(22, 16, geo);
            this.draw_bond(12, 18, geo);
        }

        if(this.name == "A") {
            this.draw_bond(9, 21, geo);
            this.draw_bond(21, 15, geo);
            this.draw_bond(15, 14, geo);
            this.draw_bond(14, 13, geo);
            this.draw_bond(13, 12, geo);
            this.draw_bond(12, 17, geo);
            this.draw_bond(17, 18, geo);
            this.draw_bond(17, 16, geo);
            this.draw_bond(15, 16, geo);
            this.draw_bond(16, 19, geo);
            this.draw_bond(19, 20, geo);
            this.draw_bond(21, 20, geo);


        }

        if(this.name == "U") {
            this.draw_bond(9, 12, geo);
            this.draw_bond(12, 13, geo);
            this.draw_bond(13, 15, geo);
            this.draw_bond(15, 16, geo);
            this.draw_bond(16, 18, geo);
            this.draw_bond(18, 19, geo);
            this.draw_bond(19, 12, geo);
            this.draw_bond(14, 13, geo);
            this.draw_bond(16, 17, geo);


        }
    };



    this.draw_cartoons = function(geo) {
        this.draw_sugar_cartoon(geo);
        this.draw_base_cartoon(geo);
    }

    this.draw_sugar_cartoon = function(geo) {
        var sugar_points = [];
        sugar_points.push( this.atoms[5].coords.clone());
        sugar_points.push( this.atoms[6].coords.clone());
        sugar_points.push( this.atoms[9].coords.clone());
        sugar_points.push( this.atoms[10].coords.clone());
        sugar_points.push( this.atoms[7].coords.clone());

        var geometry = new THREE.ConvexGeometry(sugar_points);

        for (var k = 0; k < geometry.faces.length; k++) {
            face = geometry.faces[k];
            face.color.set(this.bond_color);
        }
        var mesh = new THREE.Mesh(geometry);
        //mesh.scale.set( 1, 1, 1);
        //mesh.position.set(this.atoms[5].coords);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.updateMatrix();
        geo.merge(mesh.geometry, mesh.matrix);
    }

    this.draw_base_cartoon = function(geo) {
        var base_points_1 = [];
        var base_points_2 = [];

        if(this.name == "A") {
            base_points_1.push( this.atoms[21].coords.clone());
            base_points_1.push( this.atoms[20].coords.clone());
            base_points_1.push( this.atoms[19].coords.clone());
            base_points_1.push( this.atoms[16].coords.clone());
            base_points_1.push( this.atoms[15].coords.clone());

            base_points_2.push( this.atoms[17].coords.clone());
            base_points_2.push( this.atoms[16].coords.clone());
            base_points_2.push( this.atoms[15].coords.clone());
            base_points_2.push( this.atoms[14].coords.clone());
            base_points_2.push( this.atoms[13].coords.clone());
            base_points_2.push( this.atoms[12].coords.clone());

            this.draw_bond(9, 21, geo);
        }

        if(this.name == "G") {
            base_points_1.push( this.atoms[22].coords.clone());
            base_points_1.push( this.atoms[21].coords.clone());
            base_points_1.push( this.atoms[20].coords.clone());
            base_points_1.push( this.atoms[17].coords.clone());
            base_points_1.push( this.atoms[16].coords.clone());

            base_points_2.push( this.atoms[17].coords.clone());
            base_points_2.push( this.atoms[16].coords.clone());
            base_points_2.push( this.atoms[18].coords.clone());
            base_points_2.push( this.atoms[12].coords.clone());
            base_points_2.push( this.atoms[13].coords.clone());
            base_points_2.push( this.atoms[15].coords.clone());
        }

        if(this.name == "U") {
            base_points_1.push( this.atoms[12].coords.clone());
            base_points_1.push( this.atoms[13].coords.clone());
            base_points_1.push( this.atoms[15].coords.clone());
            base_points_1.push( this.atoms[16].coords.clone());
            base_points_1.push( this.atoms[18].coords.clone());
            base_points_1.push( this.atoms[19].coords.clone());
        }

        var geometry = new THREE.ConvexGeometry(base_points_1);

        for (var k = 0; k < geometry.faces.length; k++) {
            face = geometry.faces[k];
            face.color.set(this.bond_color);
        }
        var mesh = new THREE.Mesh(geometry);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.updateMatrix();
        geo.merge(mesh.geometry, mesh.matrix);

        if(this.name == "A" || this.name == "G") {
            var geometry = new THREE.ConvexGeometry(base_points_2);

            for (var k = 0; k < geometry.faces.length; k++) {
                face = geometry.faces[k];
                face.color.set(this.bond_color);
            }
            var mesh = new THREE.Mesh(geometry);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.updateMatrix();
            geo.merge(mesh.geometry, mesh.matrix);
        }

    }

    this.draw_bond = function(i, j, geo) {
        if(this.atoms[i] == null || this.atoms[j] == null) { console.log(i + " " + j); return; }
        var a1 = this.atoms[i];
        var a2 = this.atoms[j];
        var direction = new THREE.Vector3().subVectors(a2.coords, a1.coords);
        var arrow = new THREE.ArrowHelper(direction.clone().normalize(), a1.coords);
        var rotation = new THREE.Euler().setFromQuaternion(arrow.quaternion);
        var edgeGeometry = new THREE.CylinderGeometry( 0.15, 0.15, direction.length(), 10, 4 );
        //var edgeGeometry = new THREE.CylinderGeometry( 4, 4, 10, 10, 4 );

        for (var k = 0; k < edgeGeometry.faces.length; k++) {
            face = edgeGeometry.faces[k];
            face.color.set(this.bond_color);
        }

        var edge = new THREE.Mesh(edgeGeometry);
        edge.rotation.copy(rotation);
        //var vect = new THREE.Vector3().addVectors(a1.obj.position, direction.multiplyScalar(0.5));
        var vect = a1.coords.clone();
        var half_direct = direction.multiplyScalar(0.5);
        vect.x = parseFloat(vect.x) + parseFloat(half_direct.x);
        vect.y = parseFloat(vect.y) + parseFloat(half_direct.y);
        vect.z = parseFloat(vect.z) + parseFloat(half_direct.z);
        edge.position.copy(vect);
        //edge.position.copy(a1.obj.position);
        edge.castShadow = true;
        edge.receiveShadow = true;

        edge.updateMatrix();
        geo.merge(edge.geometry, edge.matrix);

    }
};

RNAMAKE.str_to_atom = function(s) {
    var spl = s.split(" ");
    var coords = new THREE.Vector3(parseFloat(spl[1]), parseFloat(spl[2]), parseFloat(spl[3]));
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



