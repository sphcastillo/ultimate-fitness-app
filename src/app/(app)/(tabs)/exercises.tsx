import { View, Text, TextInput, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import ExerciseCard from '@/components/ExerciseCard';
import { client } from '@/lib/sanity/client';
import { defineQuery } from 'groq';
import { Exercise } from '@/lib/sanity.types';


// You define the query here, and it will be used to fetch the exercises from the Sanity database.
export const exercisesQuery = defineQuery(`*[_type == "exercise"] {
  ...
}`);

export default function Exercises() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);

  const fetchExercises = async () => {
    try {
      // Fetch exercise data from Sanity
      const exercises = await client.fetch(exercisesQuery);
      console.log("🔥 Exercises:", exercises);
      setExercises(exercises);
      setFilteredExercises(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  }

  useEffect(() => {
    fetchExercises();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  }

  useEffect(() => {
    const filtered = exercises.filter((exercise: any) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [searchQuery, exercises]);

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='px-6 py-4 bg-white border-b border-gray-200'>
        <Text className='text-2xl font-bold text-gray-900'>Exercise Library</Text>
        <Text className='text-gray-600 mt-1'>Discover and master new exercises</Text>

        <View className='flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mt-4'>
          <Ionicons name='search' size={20} color='#6b7280' />
          <TextInput
            placeholder='Search exercises...'
            placeholderTextColor='#9CA3AF'
            className='flex-1 ml-3 text-gray-800'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name='close-circle' size={20} color='#6b7280' />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredExercises}
        renderItem={({ item }) => (
          <ExerciseCard
            item={item}
            onPress={() => router.push(`/exercise-detail?id=${item._id}`)}
          />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
            tintColor='#3b82f6'
            title='Pull to refresh exercises'
            titleColor='#6B7280'
          />
        }
        ListEmptyComponent={
          <View className="bg-white rounded-2xl p-8 items-center">
            <Ionicons name="fitness-outline" size={64} color="#9CA3AF" />
            <Text className="text-xl font-semibold text-gray-900 mt-4">
              {searchQuery ? "No exercises found" : "Loading exercises..."}
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              {searchQuery
                ? "Try adjusting your search"
                : "Your exercises will appear here"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}