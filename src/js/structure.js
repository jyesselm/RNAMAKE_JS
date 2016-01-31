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
    this.alt_names = [name[0], "r"+name[0] + "D"+name[0]];
};

RNAMAKE.ResidueTypeSet = function() {

};
