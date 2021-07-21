// ethereum remix
// pragma solidity >=0.7.0 <0.9.0;
// VS code
pragma solidity >=0.4.21 <0.7.0;

contract Ride {
    
    address payable passenger;
    address[] public Drivers;
    address public bestMatch;
    mapping (address => Driver) private Driversinfo;
    uint[] passenger_list;
    uint256 minDistance;

    struct Driver{
        uint location_x;
        uint location_y;
    }

    function addDriver(address driveraddress, uint256 xlocation, uint256 ylocation) public returns(address[] memory) {
        Drivers.push(driveraddress);
        Driversinfo[driveraddress].location_x = xlocation;
        Driversinfo[driveraddress].location_y = ylocation;
        return Drivers;
    }


    function removeDriver(address driveraddress) public {
        for (uint i=0; i<Drivers.length; i++) {
            if (driveraddress==Drivers[i]) {
                delete Drivers[i];
                break;
            }
        }
    }
    
    function match_rides(address passenger, uint256 passenger_locationx, uint256 passenger_locationy) public returns(address) {
        //match passenger to driver
        minDistance = 1000;
        bestMatch = Drivers[0];
        // bestMatch = 0x5DE55C28154Ab371Fada8307400603bD2D803810;
        for (uint i=0; i<Drivers.length; i++) {
            if (((Driversinfo[Drivers[i]].location_x -passenger_locationx )**2 + (Driversinfo[Drivers[i]].location_y -passenger_locationy )**2)<minDistance){
                minDistance = ((Driversinfo[Drivers[i]].location_x -passenger_locationx )**2 + (Driversinfo[Drivers[i]].location_y -passenger_locationy )**2);
                bestMatch = Drivers[i]; 
            }
        }
        return bestMatch;
    }

    // function payDriver(address driver){
    //     driver.send(escrowBalance);
    // }
}