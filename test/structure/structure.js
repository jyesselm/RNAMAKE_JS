/**
 * Created by josephyesselman on 1/30/16.
 */

module("structure");

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
    //ok( a.min.equals( posInf2 ), "Passed!" );
    //console.log(RNAMAKE.residue_type_set);
    ok(RNAMAKE.residue_type_set.residue_types.length == 4, "Passed!");
});

