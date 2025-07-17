import React from 'react';
import { Text, Dimensions, ScrollView } from 'react-native';
import { Heatmap } from '@dt-workspace/react-native-heatmap';
import { LineChart } from 'react-native-chart-kit';
import graphsStyles from '../js/GraphsStyle';

const screenWidth = Dimensions.get('window').width;

export default function GraphScreen() {
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
            {
                data: [20, 45, 28, 80, 99],
            },
        ],
    };

    const heatmapData = [
        { date: '2025-06-20', value: 1 },
        { date: '2025-06-21', value: 2 },
        { date: '2025-06-22', value: 4 },
        { date: '2025-06-23', value: 3 },
        { date: '2025-06-24', value: 0 },
        { date: '2025-06-25', value: 5 },
        { date: '2025-06-26', value: 2 },
        { date: '2025-06-27', value: 1 },
        { date: '2025-06-28', value: 3 },
        { date: '2025-06-29', value: 4 },
    ];

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#555', padding: 20 }}>
            <Text style={graphsStyles.title}>
                Weekly Activity
            </Text>

            <LineChart
                data={data}
                width={screenWidth - 40}
                height={220}
                yAxisSuffix="°"
                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
                    labelColor: () => '#ddd',
                    propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#1976d2',
                    },
                }}
                style={graphsStyles.lineChart}
            />

            <Text style={graphsStyles.title}>
                Heatmap
            </Text>

            <Heatmap
                data={heatmapData}
                colorScheme="github"
                startDate={new Date('2025-06-20')}
                endDate={new Date('2025-07-15')}
                style={{ width: screenWidth - 40, height: 200 }}
            />
        </ScrollView>
    );
}