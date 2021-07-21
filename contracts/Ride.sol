// ethereum remix
// pragma solidity >=0.7.0 <0.9.0;
// VS code
pragma solidity >=0.4.21 <0.7.0;

contract Ride {
    
    uint256 escrowBalance;
    address payable passenger;
    address[] public Drivers; // All the addresses of drivers
    address public bestMatch;
    mapping (address => DriverInfo) private Driversinfo;
    mapping (address => DriversAddress) private RideMatch;
    mapping (address => escrowbalance) private escrowDict;
    uint[] passenger_list;
    uint256 minDistance;
    mapping (address => driverAccept) private DriverAccDict;
    mapping (address => passengerAccept) private passengerAccDict;

    struct DriverInfo {
        uint location_x;
        uint location_y;
    }
    struct DriversAddress {
        address drivers;
    }
    struct escrowbalance{
        uint256 amount;
    }
    struct driverAccept{
        bool driverAccept; // Set to true at the end of the journey
    }

    struct passengerAccept{
        bool passengerAccept; // Set to true at the end of the journey
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
                RideMatch[passenger].drivers = bestMatch;
            }
        }
        return bestMatch;
    }
    
    // called by driver
    function accept(address passenger, uint256 amount) public{
        if (msg.sender == RideMatch[passenger].drivers){
            // pay the escrow
            escrowDict[msg.sender].amount += amount;
        }
    }

    // passenger accepts finish state first before driver
    function passengerFinished(address passenger) public {
        passengerAccDict[passenger].passengerAccept=true;
    }

    // driver accepts finish state after passenger 
    function driverFinished(address payable driver) public {
        if (DriverAccDict[driver].driverAccept && passengerAccDict[msg.sender].passengerAccept){
            driver.transfer(escrowDict[msg.sender].amount);
            escrowDict[msg.sender].amount = 0; // can only entertain one passenger at a time
        }
    }

    function driverCancel() public {
        //driver cancelling
        DriverAccDict[msg.sender].driverAccept=false;
        if(escrowDict[msg.sender].amount != 0) {
            escrowDict[msg.sender].amount = 0;
        }
    }
    function passengerCancel() public {
        passengerAccDict[msg.sender].passengerAccept =false;      
        escrowDict[RideMatch[msg.sender].drivers].amount = 0;
    }
}