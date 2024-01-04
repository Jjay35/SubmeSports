import { View, Text, Pressable, RefreshControl } from 'react-native'
import React, { useEffect } from 'react'
import { Button , TextInput} from 'react-native-paper';
import { SUBME_COLOR } from '../../../constants/constants'
import { ScrollView } from 'react-native-gesture-handler';
import FaqCollapsible from './faqCollapsible';
import faqService from './faqService';
import { useFocusEffect } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import userService from '../User/userService';

// Faq Object 
interface Faq{
    id : number;
    question : string;
    answer : string;
}


const Faq = () => {

    // Used to get information about the currently signed-in user
    const { isLoaded, user } = useUser();

    //State to check if user is editing faq
    const [isEditing, setEditing] = React.useState(false);

    //State to check if user has edititing privileges
    const [canEdit, setCanEdit] = React.useState(false);

    //construct state array for faq objects
    const [faqs, setFaqs] = React.useState<Array<Faq>>([]);

    //construct state for new faq object, used for creating new faq 
    const [question, setQuestion] = React.useState('');
    const [answer, setAnswer] = React.useState('');

    // Used to signal faq creation errors
    const [questionEmpty, setQuestionEmpty] = React.useState(false);
    const [answerEmpty, setAnswerEmpty] = React.useState(false);

    // State used for tracking refresh 
    const [refreshing, setRefreshing] = React.useState(false);

    // On refresh, reload faqs from db
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      checkHasEditingPrivilege();
      fetchFaq();
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    }, []);


    //Function to check if user has admin role, if yes, allow admin to edit faq
    const checkHasEditingPrivilege = ()=>{
        userService
        .getUserById(user.id)
        .then((response)=>{
            if(response.data.role == 0){
              setCanEdit(true);
            }else{
              setCanEdit(false);
            }
        })
        .catch((error)=>{
          "Error checking if user has editing prvillledges for faq"
        });
    }
    
    //Function to fetch FAQ objects from db
    const fetchFaq = ()=>{
      faqService
      .getAllFaqs()
      .then((response) => {
        setFaqs(response.data);
      })
      .catch((error) => {
        console.log(error)
      });
    }

    // When faq screen is shown on load, fetch faq objects from db
    useFocusEffect(
      React.useCallback(() => {
        checkHasEditingPrivilege();
        fetchFaq();
      }, [])
    );

    //Function to create FAQ object in db
    const createFaq = () => {
        const faqObject : Faq = {
            id : 0,
            question : question,
            answer : answer
        }

        faqService
        .createFaq(faqObject)
        .then((response) => {
            setFaqs([...faqs, response.data]);
          })
          .catch((error) => {
            console.log("error");
          });
    ;}

    //Function to delete FAQ object in db
    const deletefaq = (id) => {
        faqService
            .deleteFaqById(id)
            .then((response) => {
            console.log("faq deleted successfully");
            })
            .catch((error) => {
            console.log("error");
            });
    
        setFaqs(
            faqs.filter((faq) => {
            return faq.id !== id;
            })
        );
    };

    //Function to update FAQ objects in db
    const update = (id, editedQuestion, editedAnswer) => {
      const faqToUpdate = faqs.filter((faq) => {
        return faq.id === id;
      });
  
      faqService
        .updateFaq({
          id: id,
          question: editedQuestion,
          answer: editedAnswer,
        })
        .then((response) => {
          console.log("Faq udpated successfully");
        })
        .catch((error) => {
          console.log("error");
        });
  
      setFaqs(
        faqs.map((faq) => {
          return faq.id === id
            ? {
                id: id,
                question: editedQuestion,
                answer: editedAnswer,
              }
            : faq;
        })
      );
    };

    //Function to validate if FAQ can be created
    const validateFaq = ()=>{
        if(question === ""){
          setQuestionEmpty(true);
        }else{
          setQuestionEmpty(false);
        }

        if(answer === ""){
          setAnswerEmpty(true);
        }else{
          setAnswerEmpty(false);
        }

        if(question !== "" && answer !== ""){
          createFaq();
        }
    }

  return (
    <View className='w-full h-full text-center justify-center' style={{backgroundColor:SUBME_COLOR.LIGHT_BLUE}}>
         <ScrollView 
         scrollIndicatorInsets={{ right: 1 }} 
         contentContainerStyle={{justifyContent:'center', alignItems:'center'}} 
         showsHorizontalScrollIndicator={false} 
         refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {canEdit &&  !isEditing &&
        <View className='w-full mb-10 items-end mt-2 mr-2'>
          <Button onPress={()=>setEditing(!isEditing)} textColor ='#000000' className='min-w-fit' style={{backgroundColor:SUBME_COLOR.RED}}>Edit</Button>
        </View>}
        {canEdit && isEditing &&
        <View className='w-full mb-10 items-end mt-2 mr-2'>
          <Button onPress={()=>{setEditing(!isEditing); setQuestion(""); setAnswer("")}} textColor ='#000000' className=' min-w-fit' style={{backgroundColor:SUBME_COLOR.RED}}>
            <Text className='text-black '>Done</Text>
            </Button>
        </View>}

          {isEditing && 
          <View className='w-3/5 mb-5'>
            <TextInput className='' placeholder='Question' dense multiline onChangeText={(e)=>setQuestion(e)}/>
            {questionEmpty && <Text className=' text-red-500'>Question cannot be empty</Text>}
            <TextInput className=' mt-5' placeholder='Answer' dense multiline onChangeText={(e)=>setAnswer(e)}/>
            {answerEmpty && <Text className='text-red-500'>Answer cannot be empty</Text>}
            <Button textColor ='#000000' className='min-w-fit mt-5' style={{backgroundColor:SUBME_COLOR.RED}} onPress={()=>validateFaq()}>Add New Faq</Button>
          </View>
          }
        
            {faqs.map((faq : Faq, index)=>(
                <View key={index} className='w-full h-auto border-b-2' style={{}}>
                    <FaqCollapsible
                        faqID = {faq.id}
                        isEditing={isEditing}
                        deleteFaq = {deletefaq}
                        updateFaq = {update}
                        question = {faq.question}
                        answer = {faq.answer}
                    />
                </View>
            ))  
            }
        </ScrollView> 
    </View>
  )
}

export default Faq