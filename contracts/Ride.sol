// ethereum remix
// pragma solidity >=0.7.0 <0.9.0;
// VS code
pragma solidity >=0.7.0 <0.9.0;

contract Ride {
    
    uint256 escrowBalance;
    bool lock = false;
    uint256 payAmount;
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
    mapping (address => MapToPassenger) private DriverToPassenger;


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

    struct MapToPassenger{
        address drivers;
    }

    function addDriver(address driveraddress, uint256 xlocation, uint256 ylocation) public returns(address[] memory) {
        Drivers.push(driveraddress);
        Driversinfo[driveraddress].location_x = xlocation;
        Driversinfo[driveraddress].location_y = ylocation;
        return Drivers;
        // return Driversinfo[0xaBA2eAB6A94977e2c571CD0371BB25Bfda16b978].location_x;
    }


    function removeDriver(address driveraddress) public returns (address[] memory) {
        for (uint i=0; i<Drivers.length; i++) {
            if (driveraddress==Drivers[i]) {
                delete Drivers[i];
                break;
                return Drivers;
            }
        }
    }
    
    function getPassengerList() public view returns (uint[] memory) {
        return passenger_list;
    }

    function match_rides(address passenger, uint256 passenger_locationx, uint256 passenger_locationy) public returns(address) {
        //match passenger to driver
        minDistance = 1000;
        bestMatch = Drivers[0];
        // bestMatch = 0x5DE55C28154Ab371Fada8307400603bD2D803810;
        for (uint i=0; i<Drivers.length; i++) {
            if(Drivers[i] != 0x0000000000000000000000000000000000000000) {
                if (((Driversinfo[Drivers[i]].location_x -passenger_locationx )**2 + (Driversinfo[Drivers[i]].location_y -passenger_locationy )**2)<minDistance){
                    minDistance = ((Driversinfo[Drivers[i]].location_x -passenger_locationx )**2 + (Driversinfo[Drivers[i]].location_y -passenger_locationy )**2);
                    bestMatch = Drivers[i];
                    DriversAddress memory dAdd = DriversAddress(bestMatch);
                    // RideMatch[passenger].drivers = bestMatch;
                    RideMatch[passenger] = dAdd;
                }
            }
        }
        DriverToPassenger[bestMatch].drivers = passenger;
        return bestMatch;
        // return RideMatch[passenger].drivers;
    }
    
    // called by driver
    function accept(address passenger, uint256 amount) public returns(uint256){
        // return RideMatch[passenger].drivers;
        if (msg.sender == RideMatch[passenger].drivers){
            DriverAccDict[msg.sender].driverAccept=true;
            // pay the escrow
            escrowDict[msg.sender].amount += amount;
            return escrowDict[msg.sender].amount;
        }
    }

    // passenger accepts finish state first before driver
    function passengerFinished(address passenger) public returns(bool) {
        passengerAccDict[passenger].passengerAccept=true;
        return passengerAccDict[passenger].passengerAccept;
    }

    // driver accepts finish state after passenger 
    function driverFinished(address passenger, address payable driver) public returns(uint256) {
        require(!lock);
        lock = true;
        if (DriverAccDict[msg.sender].driverAccept && passengerAccDict[passenger].passengerAccept){
            // return escrowDict[msg.sender].amount;
            driver.transfer(escrowDict[msg.sender].amount);
            escrowDict[msg.sender].amount = 0; // can only entertain one passenger at a time
            lock = false;
            return escrowDict[msg.sender].amount;
        }
    }

    function driverCancel(address payable passenger) public returns(uint256) {
        //driver cancelling
        DriverAccDict[msg.sender].driverAccept=false;
        // if(escrowDict[msg.sender].amount != 0) {
        //     payAmount = escrowDict[msg.sender].amount;
        //     escrowDict[msg.sender].amount = 0;
        //     passenger.transfer(payAmount);
        //     payAmount = 0;
        // }
        require(!lock);
        lock = true;
        DriverAccDict[msg.sender].driverAccept=false;
        if(escrowDict[msg.sender].amount != 0) {
            escrowDict[msg.sender].amount = 0;
            passenger.transfer(escrowDict[msg.sender].amount);
        }
        lock = false;
        return escrowDict[msg.sender].amount;
    }
    
    function passengerCancel(address payable passenger) public returns(uint256) {
        require(!lock);
        lock = true;
        passengerAccDict[msg.sender].passengerAccept = false;
        passenger.transfer(escrowDict[RideMatch[msg.sender].drivers].amount);
        escrowDict[RideMatch[msg.sender].drivers].amount = 0;
        lock = false;
        return escrowDict[RideMatch[msg.sender].drivers].amount;
    }

    function getBestMatch(address driver) public view returns (address){
        return DriverToPassenger[driver].drivers;
    }
}