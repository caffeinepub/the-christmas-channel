import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import { migration } "DJMigration";

(with migration)
actor {
  type Show = {
    showName : Text;
    hostName : Text;
    description : Text;
    dayOfWeek : Nat; // 0=Sunday, 6=Saturday
    startHour : Nat; // 0-23 (CST)
    endHour : Nat; // 0-23 (CST)
  };

  type DJ = {
    id : Nat;
    name : Text;
    bio : Text;
    specialty : Text;
    photoUrl : Text;
  };

  type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let showMap = Map.empty<Text, Show>();
  let djMap = Map.empty<Nat, DJ>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextDjId = 0;
  var nextShowId = 0;

  func storeShowInternal(show : Show) : Nat {
    let id = nextShowId;
    showMap.add(id.toText(), show);
    nextShowId += 1;
    id;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getAllShows() : async [Show] {
    showMap.values().toArray();
  };

  public shared ({ caller }) func addShow(show : Show) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add shows");
    };
    storeShowInternal(show);
  };

  public shared ({ caller }) func updateShow(id : Nat, show : Show) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update shows");
    };
    if (not showMap.containsKey(id.toText())) {
      Runtime.trap("Show not found");
    };
    showMap.add(id.toText(), show);
  };

  public shared ({ caller }) func removeShow(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can remove shows");
    };
    if (not showMap.containsKey(id.toText())) {
      Runtime.trap("Show not found");
    };
    showMap.remove(id.toText());
  };

  public shared ({ caller }) func clearAllShows() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can clear shows");
    };
    showMap.clear();
  };

  public query ({ caller }) func getCurrentShow() : async ?Show {
    let icTime = Time.now();
    // Subtract 6 hours to convert UTC to CST
    let cstTime = icTime - 6 * 3600 * 1_000_000_000;
    // Number of whole days since Unix epoch (Jan 1 1970 = Thursday)
    let cstDays = cstTime / (24 * 3600 * 1_000_000_000);
    // +4 offset so that epoch day 0 (Thursday) maps to 4 in 0=Sunday scheme
    let cstDayOfWeek = (cstDays + 4) % 7;
    let cstHour = (cstTime / (3600 * 1_000_000_000)) % 24;

    showMap.values().find(
      func(show) {
        show.dayOfWeek == cstDayOfWeek and cstHour >= show.startHour and cstHour < show.endHour
      }
    );
  };

  public query ({ caller }) func getShowsForDay(dayOfWeek : Nat) : async [Show] {
    let dayShows = List.empty<Show>();
    for ((_, show) in showMap.entries()) {
      if (show.dayOfWeek == dayOfWeek) {
        dayShows.add(show);
      };
    };
    dayShows.toArray();
  };

  // DJ management
  public query ({ caller }) func getDJs() : async [DJ] {
    djMap.values().toArray();
  };

  public shared ({ caller }) func addDJ(name : Text, bio : Text, specialty : Text, photoUrl : Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add DJs");
    };
    let id = nextDjId;
    let newDJ : DJ = {
      id;
      name;
      bio;
      specialty;
      photoUrl;
    };
    djMap.add(id, newDJ);
    nextDjId += 1;
    id;
  };

  public shared ({ caller }) func removeDJ(djId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can remove DJs");
    };
    if (not djMap.containsKey(djId)) {
      Runtime.trap("DJ not found");
    };
    djMap.remove(djId);
  };
};
