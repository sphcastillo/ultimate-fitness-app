import { View, Text } from 'react-native';
import { Exercise } from "@/lib/sanity.types";

interface ExerciseCardProps {
  item: Exercise;
  onPress: () => void;
}
export default function ExerciseCard({item, onPress}: ExerciseCardProps) {
  return (
    <View>
      <Text>ExerciseCard</Text>
    </View>
  )
}