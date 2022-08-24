import React, { useEffect, useState, lazy, Suspense } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import "@app/App.scss";
import Header from "@app/layout/header/Header";
import Footer from "@app/layout/footer/Footer";
import Drawer from "@app/layout/drawer/Drawer";
import Notification from "@app/layout/notification/Notification";

import { AuthProvider } from "./auth/auth";
import getLegalList from "./getLegalList";
import ScrollTop from "@app/module/scrollTop/ScrollTop";
import Cookies from "js-cookie";

const Home = lazy(() => import("@app/pages/home/Home"));
const Register = lazy(() => import("@app/pages/register/Register"));
const Login = lazy(() => import("@app/pages/login/Login"));
const RegisterToConfirm = lazy(() =>
	import("@app/pages/registerToConfirm/RegisterToConfirm")
);
const RegisterConfirmed = lazy(() =>
	import("@app/pages/registerConfirmed/RegisterConfirmed")
);
const MemberSpace = lazy(() => import("@app/pages/memberSpace/MemberSpace"));
const EditInfo = lazy(() => import("@app/pages/editInfo/EditInfo"));
const ChangePassword = lazy(() =>
	import("@app/pages/changepassword/ChangePassword")
);
const ChangeEmail = lazy(() => import("@app/pages/changeemail/ChangeEmail"));
const ChangeEmailConfirm = lazy(() =>
	import("@app/pages/changeemailConfirm/ChangeEmailConfirm")
);
const BecomeArtist = lazy(() => import("@app/pages/becomeArtist/BecomeArtist"));
const EditArtist = lazy(() => import("@app/pages/editArtist/EditArtist"));
const DeleteArtist = lazy(() => import("@app/pages/deleteArtist/DeleteArtist"));
const Contact = lazy(() => import("@app/pages/contact/Contact"));
const ContactConfirmed = lazy(() =>
	import("@app/pages/contactConfirmed/ContactConfirmed")
);
const About = lazy(() => import("@app/pages/about/About"));
const Legal = lazy(() => import("@app/pages/legal/Legal"));
const NotFound = lazy(() => import("@app/pages/notFound/NotFound"));
const MySongs = lazy(() => import("@app/pages/mySongs/MySongs"));
const AddSong = lazy(() => import("@app/pages/addSong/AddSong"));
const EditSong = lazy(() => import("@app/pages/editSong/EditSong"));
const MyPlaylist = lazy(() => import("@app/pages/myPlaylists/MyPlaylists"));
const AddPlaylist = lazy(() => import("@app/pages/addPlaylist/AddPlaylist"));
const EditPlaylist = lazy(() => import("@app/pages/editPlaylist/EditPlaylist"));
const Catalogue = lazy(() => import("@app/pages/catalogue/Catalogue"));
const SongPage = lazy(() => import("@app/pages/song/SongPage"));
const PlaylistPage = lazy(() => import("@app/pages/playlist/PlaylistPage"));
const ArtistPage = lazy(() => import("@app/pages/artist/ArtistPage"));
const MyFollowContent = lazy(() =>
	import("@app/pages/myFollowContent/MyFollowContent")
);
const StatsSong = lazy(() => import("@app/pages/statsSong/StatsSong"));
const StatsPlaylist = lazy(() =>
	import("@app/pages/statsPlaylist/StatsPlaylist")
);
const StatsUser = lazy(() => import("@app/pages/statsUser/StatsUser"));
const SubscribePage = lazy(() => import("@app/pages/subscribe/SubscribePage"));

import Loader from "@app/module/loader/Loader";

function LoaderPage() {
	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Loader size="200px" />
		</div>
	);
}

export default function App() {
	const [drawerOpen, openDrawer] = useState(false);
	const [notificationOpen, setNotificationOpen] = useState(false);
	const [notificationContent, setNotificationContent] = useState("");

	const [legals, setLegals] = useState([]);

	const fixBody = () => {
		document.querySelector("body").style.overflow = "hidden";
		document.querySelector("body").style.height = "100vh";
	};

	const releaseBody = () => {
		document.querySelector("body").style.overflow = null;
		document.querySelector("body").style.height = null;
	};

	const toggleDrawer = () => {
		openDrawer(!drawerOpen);
		drawerOpen ? releaseBody() : fixBody();
	};

	const closeDrawer = () => {
		openDrawer(false);
		releaseBody();
	};

	const getAuthFromSession = () => {
		if (Cookies.get("auth") != null) {
			return JSON.parse(Cookies.get("auth"));
		}
		return null;
	};

	const saveAuthInSession = (auth) => {
		Cookies.set("auth", JSON.stringify(auth), {
			expires: 1,
			secure: true,
			sameSite: "strict",
		});
	};

	const removeAuthOfSession = () => {
		Cookies.remove("auth");
	};

	const [auth, setAuth] = useState({
		token: getAuthFromSession()?.token,
		isAuth: getAuthFromSession() ? true : false,
		id: getAuthFromSession()?.id,
		artist: getAuthFromSession()?.artist,
		isSubscribe: getAuthFromSession()?.isSubscribe,
	});

	const login = (auth) => {
		if (auth != null) {
			saveAuthInSession(auth);

			setAuth({
				token: getAuthFromSession().token,
				id: getAuthFromSession().id,
				isAuth: true,
				artist: getAuthFromSession().artist,
				isSubscribe: getAuthFromSession().isSubscribe,
			});
		}
	};

	const logout = () => {
		removeAuthOfSession();
		setAuth({
			token: null,
			isAuth: false,
			id: null,
			artist: false,
			isSubscribe: false,
		});

		setTimeout(() => {
			if (window.location.pathname != "/login") window.location.reload();
		}, 100);
	};

	const updateAuth = (auth) => {
		saveAuthInSession(auth);
	};

	const openNotification = (content) => {
		setNotificationContent(content);
		setNotificationOpen(true);
	};

	const closeNotification = () => {
		setNotificationOpen(false);
	};

	useEffect(async () => {
		const legalsElements = await getLegalList();
		setLegals(legalsElements);
	}, []);

	sessionStorage.setItem("fixVideo", Math.random());

	return (
		<div className="app">
			<AuthProvider value={{ auth, login, logout, updateAuth }}>
				<Notification
					notificationOpen={notificationOpen}
					notificationContent={notificationContent}
					closeNotification={closeNotification}
				/>
				<Router>
					<ScrollTop />
					<Header
						toggleDrawer={toggleDrawer}
						closeDrawer={closeDrawer}
					/>
					<Drawer
						drawerOpen={drawerOpen}
						toggleDrawer={toggleDrawer}
						legals={legals}
					/>
					<div style={{ minHeight: "100vh" }}>
						<Suspense fallback={<LoaderPage />}>
							<Switch>
								<Route exact path="/">
									<Home />
								</Route>
								<Route exact path="/register">
									{auth.isAuth ? (
										<Redirect to="/" />
									) : (
										<Register />
									)}
								</Route>
								<Route exact path="/register-to-confirm">
									<RegisterToConfirm />
								</Route>
								<Route
									exact
									path="/register-confirm/:confirmToken"
									children={<RegisterConfirmed />}
								></Route>
								<Route path="/login" exact>
									{auth.isAuth ? (
										<Redirect to="/" />
									) : (
										<Login />
									)}
								</Route>
								<Route path="/space-member">
									{!auth.isAuth ? (
										<Redirect to="/login" />
									) : (
										<Switch>
											<Route exact path="/space-member">
												<MemberSpace />
											</Route>
											<Route
												exact
												path="/space-member/edit-infos"
											>
												<EditInfo
													openNotification={
														openNotification
													}
												/>
											</Route>
											<Route
												exact
												path="/space-member/change-password"
											>
												<ChangePassword
													openNotification={
														openNotification
													}
												/>
											</Route>
											<Route
												exact
												path="/space-member/change-email"
											>
												<ChangeEmail
													openNotification={
														openNotification
													}
												/>
											</Route>
											<Route
												exact
												path="/space-member/artist-space"
											>
												{!auth.artist ? (
													<BecomeArtist
														openNotification={
															openNotification
														}
													/>
												) : (
													<Redirect to="/space-member" />
												)}
											</Route>
											<Route
												exact
												path="/space-member/edit-artist-space"
											>
												{auth.artist ? (
													<EditArtist
														openNotification={
															openNotification
														}
													/>
												) : (
													<Redirect to="/space-member" />
												)}
											</Route>
											<Route
												exact
												path="/space-member/delete-artist"
											>
												{auth.artist ? (
													<DeleteArtist
														openNotification={
															openNotification
														}
													/>
												) : (
													<Redirect to="/space-member" />
												)}
											</Route>
											<Route
												exact
												path="/space-member/my-songs"
											>
												{auth.artist ? (
													<MySongs />
												) : (
													<Redirect to="/space-member" />
												)}
											</Route>
											<Route
												exact
												path="/space-member/add-song"
											>
												{auth.artist ? (
													<AddSong
														openNotification={
															openNotification
														}
													/>
												) : (
													<Redirect to="/space-member" />
												)}
											</Route>
											<Route
												exact
												path="/space-member/edit-song/:id"
											>
												{auth.artist ? (
													<EditSong
														openNotification={
															openNotification
														}
													/>
												) : (
													<Redirect to="/space-member" />
												)}
											</Route>
											<Route
												exact
												path="/space-member/my-playlists"
											>
												<MyPlaylist
													openNotification={
														openNotification
													}
												/>
											</Route>
											<Route
												exact
												path="/space-member/add-playlists"
											>
												<AddPlaylist
													openNotification={
														openNotification
													}
												/>
											</Route>
											<Route
												exact
												path="/space-member/edit-playlists/:slug"
											>
												<EditPlaylist
													openNotification={
														openNotification
													}
												/>
											</Route>
											<Route
												exact
												path="/space-member/my-follow-content"
											>
												<MyFollowContent />
											</Route>
											<Route
												exact
												path="/space-member/stats-song/:slug"
											>
												<StatsSong />
											</Route>
											<Route
												exact
												path="/space-member/stats-playlist/:slug"
											>
												<StatsPlaylist />
											</Route>
											<Route
												exact
												path="/space-member/stats"
											>
												{auth.artist ? (
													<StatsUser />
												) : (
													<Redirect to="/space-member" />
												)}
											</Route>
											<Route
												exact
												path="/space-member/subscribe"
											>
												<SubscribePage />
											</Route>
											<Route path="*">
												<NotFound />
											</Route>
										</Switch>
									)}
								</Route>
								<Route exact path="/catalogue">
									<Catalogue />
								</Route>
								<Route
									exact
									path="/confirm-change-email/:token"
								>
									<ChangeEmailConfirm />
								</Route>
								<Route path="/contact" exact>
									<Contact />
								</Route>
								<Route exact path="/contact/confirmed">
									<ContactConfirmed />
								</Route>
								<Route exact path="/about">
									<About />
								</Route>
								<Route exact path="/legal/:slug">
									<Legal />
								</Route>
								<Route exact path="/song/:slug">
									<SongPage />
								</Route>
								<Route exact path="/playlist/:slug">
									<PlaylistPage />
								</Route>
								<Route exact path="/artist/:slug">
									<ArtistPage />
								</Route>
								<Route path="/error404" exact>
									<NotFound />
								</Route>
								<Route path="*">
									<NotFound />
								</Route>
							</Switch>
						</Suspense>
					</div>
					<Footer legals={legals} />
				</Router>
			</AuthProvider>
		</div>
	);
}
