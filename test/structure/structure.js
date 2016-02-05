/**
 * Created by josephyesselman on 1/30/16.
 */

module("structure");

test("atom_constructor", function() {
    var coords = new THREE.Vector3(0, 0, 0);
    var a = new RNAMAKE.Atom("P1", coords);

    a.obj.position.add(new THREE.Vector3(1, 0, 0));

    ok(a.name == "P1", "Passed!");
    ok(a.obj.position.x == 1, "Passed!");
    ok(coords.x == 0, "Passed!");
});

test("atom_copy", function() {
    var coords = new THREE.Vector3(0, 0, 0);
    var a = new RNAMAKE.Atom("P1", coords);
    var a2 = a.copy();

    a.obj.position.addScalar(1);
    ok(a2.coords().x == 0, "Passed!");
    ok(a.coords().x == 1, "Passed!");

});

test("atom_str_to_atom", function() {
    var s = "P 1.0 2.0 3.0";
    var a = RNAMAKE.str_to_atom(s);
    ok(a.name == "P", "Passed!");
    ok(a.coords().x == 1, "Passed!");
    ok(a.coords().y == 2, "Passed!");
    ok(a.coords().z == 3, "Passed!");
});

test("residue_type_set_constructor", function() {
    var rts = new RNAMAKE.ResidueTypeSet();
    //ok( a.min.equals( posInf2 ), "Passed!" );
    ok(rts.residue_types.length == 4, "Passed!");
});

test("residue_type_get_rtype_by_resname", function() {
    var rts = new RNAMAKE.ResidueTypeSet();
    var rtype = rts.get_rtype_by_resname("GUA");
    ok(rtype != null, "Passed!");

    rtype = rts.get_rtype_by_resname("G");
    ok(rtype != null, "Passed!");

    rtype = rts.get_rtype_by_resname("rG");
    ok(rtype != null, "Passed!");
});

test("residue_type_set_singleton", function() {
    ok(RNAMAKE.residue_type_set.residue_types.length == 4, "Passed!");
});

test("residue_constructor", function() {
    var rtype = RNAMAKE.residue_type_set.get_rtype_by_resname("GUA");
    var r = new RNAMAKE.Residue(rtype, "G", 1, "A");
    ok(r.name == "G", "Passed!");
    ok(r.rtype.name == "GUA", "Passed!");
});

test("residue_str_to_residue", function() {
    var reader = new RNAMAKE.FileReaderXML();
    var lines = reader.read_file(RNAMAKE.PATH + "/test/resources/res_strs.dat");
    var r = RNAMAKE.str_to_res(lines[0]);

    ok(r.name == "G", "Passed!");
});





