import React, {useState , useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Modal,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import RadioButton from './radioButton'
import { initialFilter } from '../constants/initialFilter';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';

const CustomModal = ({ modalVisible, setModalVisible, games, onApplyFilter, onClearFilter, filterGames}) => {

    
    const [isOpen, setIsOpen] = useState(false)
    const [isOpen2, setIsOpen2] = useState(false)
    const [isOpen3, setIsOpen3] = useState(false)
    const [isOpen4, setIsOpen4] = useState(false)

    const [currentValue, setCurrentValue] = useState()

    const [uniqueSports, setUniqueSports] = useState([]);
    const [uniqueGameType, setUniqueGameType] = useState([])
    const [uniqueDistance, setUniqueDistance] = useState([]);
    const [uniqueGender, setUniqueGender] = useState([]);

    const [selectedGameType, setSelectedGameType] = useState(null)
    const [selectedSport, setSelectedSport] = useState(null);
    const [selectedDistance, setSelectedDistance] = useState(null)
    const [selectedGender, setSelectedGender] = useState(null)

  useEffect(() => {
    // Extract unique sports from games
    const uniqueSportsSet = new Set(games.map(game => game.sport));
    const uniqueGameType = ["Sub Needed", "Pick Up Game", "New Team", "Class"]
    const uniqueDistanceSet = [5, 10, 15 ,20, 25 , 30 ,35 , 40, 45];
    const uniqueGender = ["Male", "Female", "Coed"]
    const uniqueSportsArray = [...uniqueSportsSet];
    const uniqueDistanceArray = [...uniqueDistanceSet];
    const uniqueGameTypeArray = [...uniqueGameType];
    const uniqueGenderArray = [...uniqueGender];

    setUniqueGameType(uniqueGameTypeArray)
    setUniqueSports(uniqueSportsArray);
    setUniqueDistance(uniqueDistanceArray);
    setUniqueGender(uniqueGenderArray)
  }, [games]);
  
  
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      style={{ flex: 1 }}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <ScrollView nestedScrollEnabled={true} className=" h-screen" showsVerticalScrollIndicator={false}>
        <View className="z-[1000]"style={styles.filterComp}>
          <Text style={{ fontSize: 26 }}>Filtering Sports</Text>
          <DropDownPicker 
          style={styles.dropDown}
          items={uniqueSports.map((sport) => ({ label: sport, value: sport}))} 
          open={isOpen} 
          setOpen={() => setIsOpen(!isOpen)} 
          value={selectedSport} 
          placeholder='Select Sports'
          setValue={sport => setSelectedSport(sport)}
          itemKey='label'
          multiple={true}
          min={1}
          max={8}
          mode="BADGE"
          listMode="SCROLLVIEW"
          />
        </View>


        <View className="z-[999]"style={styles.filterComp}>
          <Text style={{ fontSize: 26 }}>Filtering Distance</Text>
          <DropDownPicker 
          style={styles.dropDown}
          items={uniqueDistance.map((distance) => ({ label: distance + " miles", value: distance}))} 
          open={isOpen2} 
          setOpen={() => setIsOpen2(!isOpen2)} 
          placeholder='Select Distances'
          value={selectedDistance} 
          setValue={distance => setSelectedDistance(distance)}
          itemKey='label'
          listMode="SCROLLVIEW"
          
         
          />
          {console.log(selectedDistance)}
        </View>

        <View className="z-[998]"style={styles.filterComp}>
          <Text style={{ fontSize: 26 }}>Filtering Game Types</Text>
          <DropDownPicker 
          style={styles.dropDown}
          items={uniqueGameType.map((gameType) => ({ label: gameType, value: gameType}))} 
          open={isOpen3} 
          setOpen={() => setIsOpen3(!isOpen3)} 
          value={selectedGameType} 
          placeholder='Select Game Type'
          setValue={gameType => setSelectedGameType(gameType)}
          itemKey='label'
          multiple={true}
          min={1}
          max={4}
          mode="BADGE"
          listMode="SCROLLVIEW"
         
          />
        </View>

        <View style={styles.filterComp}>
          <Text style={{ fontSize: 26 }}>Filtering Gender</Text>
          <DropDownPicker 
          style={styles.dropDown}
          items={uniqueGender.map((genderType) => ({ label: genderType, value: genderType}))} 
          open={isOpen4} 
          setOpen={() => setIsOpen4(!isOpen4)} 
          value={selectedGender} 
          placeholder='Select Gender'
          setValue={gender => setSelectedGender(gender)}
          itemKey='label'
          multiple={true}
          min={1}
          max={3}
          mode="BADGE"
          listMode="SCROLLVIEW"
          />
        </View>
        </ScrollView>

        <Button title="Apply" onPress={() => {
          setModalVisible(!modalVisible)
          onApplyFilter(selectedSport, selectedDistance, selectedGameType, selectedGender)
          // setSelectedSport(null)
          // setSelectedDistance(null)
        }} />
        <Button title="Clear" onPress={() => {
          setModalVisible(!modalVisible)
          onClearFilter()
          setSelectedSport(null)
          setSelectedDistance(null)
          setSelectedGameType(null)
          setSelectedGender(null)
        }} />
       
      </SafeAreaView>
    </Modal>
  );
};

export default CustomModal;


const styles = StyleSheet.create({
  filterComp: {
    flex: 1,
    padding: 30,
  },
  dropDown: {
    flex: 1,
    marginBottom: 0,
    
  }
})