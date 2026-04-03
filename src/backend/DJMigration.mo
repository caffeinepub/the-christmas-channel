import Map "mo:core/Map";

module DJMigration {
  // DJOld now matches the current on-chain stable type (photoUrl already exists)
  type DJOld = {
    id : Nat;
    name : Text;
    bio : Text;
    specialty : Text;
    photoUrl : Text;
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
    // No structural change needed — pass through as-is
    { djMap = old.djMap };
  };
};
