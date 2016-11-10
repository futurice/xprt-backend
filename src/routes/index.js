import expertEndpoints from './experts';
import teacherEndpoints from './teachers';
import lectureEndpoints from './lectures';
import feedbackEndpoints from './feedback';

let routes = [];

// TODO: hapi plugins?
//routes = routes.concat(userEndpoints);
routes = routes.concat(expertEndpoints);
routes = routes.concat(teacherEndpoints);
routes = routes.concat(lectureEndpoints);
routes = routes.concat(feedbackEndpoints);

export default routes;
