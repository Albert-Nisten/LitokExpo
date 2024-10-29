import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../tabs/Home";
import Profile from "../tabs/Profile";
import Search from "../tabs/Search";
import Market from '../tabs/Market';
import { Feather, AntDesign, MaterialCommunityIcons} from '@expo/vector-icons'
import { AppName, Left, Right } from "../tockElements/Toolbar";
import Chat from "../tabs/Chat";
import { DrawerContentScrollView, DrawerItem, createDrawerNavigator } from "@react-navigation/drawer";
import AddProducts from "../tabs/AddProducts";
import Dashboard from "../dash/Dashboard";
import DashUsers from "../dash/DashUsers";
import DashMenu from "../dash/DashMenu";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();


const CustomDrawerContent = (props) => (
    <DrawerContentScrollView {...props}>
        {DashMenu.map((data, key) => (
            <DrawerItem
                label = "Usuários" 
                icon = {({color, size}) => <Feather color={color} size={size} name = 'users' />}
                onPress={() => props.navigation.navigate("DashUsers")}
            />
        ))}
    </DrawerContentScrollView>
)

const MainDash = () => (
    <Drawer.Navigator
        // drawerContent={(props) => <CustomDrawerContent {...props}/>}
        screenOptions={{
            headerLeft: () => null,
            drawerType: "permanent"
        }}
    >
        <Drawer.Screen 
            name = "Dashboard" 
            component={Dashboard} 
        />
        <Drawer.Screen 
            name = "DashUsers" 
            component={DashUsers} 
            options={{
                title: "Clientes"
            }}
        />
        
    </Drawer.Navigator>
)

export default MainDash;