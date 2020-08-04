import React, {Component} from 'react';
import {LinearProgress, Typography} from '@material-ui/core';

function withSplashScreen(WrappedComponent) {
     return (
     <div className='splash-screen'>
           <Typography variant="h6" component="h1" align='center' gutterBottom='true'>
             Please wait a moment while we load your app.
           </Typography>
           <LinearProgress />
       </div>
     );
 };


export default withSplashScreen;