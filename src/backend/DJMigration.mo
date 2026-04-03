import Map "mo:core/Map";
import Array "mo:core/Array";

module DJMigration {
  type DJOld = {
    id : Nat;
    name : Text;
    bio : Text;
    specialty : Text;
  };

  type DJNew = {
    id : Nat;
    name : Text;
    bio : Text;
    specialty : Text;
    photoUrl : Text;
  };

  public func migration(
    old : { djMap : Map.Map<Nat, DJOld> }
  ) : { djMap : Map.Map<Nat, DJNew> } {
    let newMap = Map.empty<Nat, DJNew>();
    for ((k, v) in old.djMap.entries()) {
      newMap.add(k, {
        id = v.id;
        name = v.name;
        bio = v.bio;
        specialty = v.specialty;
        photoUrl = "";
      });
    };
    { djMap = newMap };
  };
};
