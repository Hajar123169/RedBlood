import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { UserDataProvider } from './src/contexts/UserDataContext';
import { DonationProvider } from './src/contexts/DonationContext';
import { RequestProvider } from './src/contexts/RequestContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AuthProvider>
                    <UserDataProvider>
                        <DonationProvider>
                            <RequestProvider>
                                <AppNavigator />
                            </RequestProvider>
                        </DonationProvider>
                    </UserDataProvider>
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
