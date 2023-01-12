import { useNavigate, useParams } from "react-router-dom";
import stories from "app/data/intagram-stories.json";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InstagramStoryScreenLine from "app/components/Instagram/Story/InstagramStoryScreenLine.component";

type Props = {
	single?: boolean
}

const InstagramStoryScreen = ({ single = false }: Props) => {

	const { storyId = 0, userStoryIndex = 0 } = useParams();

	const activeGlobalStories = stories.filter(story => story.images.length !== 0).sort((a, b) => +a.id - +b.id);
	const currentUserStories = activeGlobalStories.find(story => +story.id === +storyId) ?? null;


	const lastGlobalStoryId = activeGlobalStories[ activeGlobalStories.length - 1 ].id;
	const firstGlobalStoryId = activeGlobalStories[ 0 ].id;

	const navigate = useNavigate();

	const onNextStory = () => {
		if (currentUserStories === null) return;
		if (single) navigate(-1);

		//Current story has nested stories
		if (currentUserStories.images.length > 1) {
			if ((+userStoryIndex + 1) < currentUserStories.images.length) {
				navigate(`/instagram/story/${ currentUserStories.id }/${ +userStoryIndex + 1 }`);
				return;
			}
		}
		if (+storyId + 1 > lastGlobalStoryId) {
			navigate("/instagram");
			return;
		}
		const currentStoryIndexInGlobalActiveStories = activeGlobalStories.findIndex(story => +story.id === +currentUserStories.id);
		navigate(`/instagram/story/${ activeGlobalStories[ currentStoryIndexInGlobalActiveStories + 1 ].id }`);
	};

	const onPrevStory = () => {
		if (currentUserStories === null || single) return;
		if (+storyId - 1 < firstGlobalStoryId) {
			navigate("/instagram");
			return;
		}

		const currentStoryIndexInGlobalActiveStories = activeGlobalStories.findIndex(story => +story.id === +currentUserStories.id);

		//Check if user is on first of his stories
		if (+userStoryIndex === 0) {
			//Check if next story has nested stories
			if (activeGlobalStories[ currentStoryIndexInGlobalActiveStories - 1 ].images.length > 0) {
				const nextStoryPage = activeGlobalStories[ currentStoryIndexInGlobalActiveStories - 1 ];
				navigate(`/instagram/story/${ nextStoryPage.id }/${ nextStoryPage.images.length - 1 }`);
				return;
			}
		}

		//Check if user has any previous nested stories
		if (+userStoryIndex > 0) {
			navigate(`/instagram/story/${ currentUserStories.id }/${ +userStoryIndex - 1 }`);
			return;
		}
		navigate(`/instagram/story/${ activeGlobalStories[ currentStoryIndexInGlobalActiveStories - 1 ].id }`);
	};

	return (
		<>
			{
				currentUserStories !== null
					&&
					<div className="instagram-story-screen">
						<div
							className="instagram-story-screen__content"
							style={ { backgroundImage: `url(${ currentUserStories.images[ +userStoryIndex ] })` } }
						>
							<div className="instagram-story-screen__left-click" onClick={ onPrevStory }></div>
							<div className="instagram-story-screen__right-click" onClick={ onNextStory }></div>
							<div className="instagram-story-screen__header">
								<div
									className="instagram-story-screen__time-lines-wrapper"
                                    style={ { gridTemplateColumns: currentUserStories.images.map(_ => `1fr`).join(" ") } }
								>
									{
										Array(currentUserStories.images.length)
											.fill(0)
											.map((_, index) => <InstagramStoryScreenLine key={ index } isActive={ index <= +userStoryIndex }/>)
									}
								</div>
								<div className="instagram-story-screen__header-body">
									<div className="instagram-story-screen__header-user-data">
										<div
											className="instagram-story-screen__user-image"
											style={ { backgroundImage: `url(${ currentUserStories.backgroundImageURL })` } }
										></div>
										<div className="instagram-story-screen__user-name">
											{ currentUserStories.name }
										</div>
									</div>
									<FontAwesomeIcon
										icon={ faXmark }
										color="white"
										onClick={ () => navigate("/instagram") }
										className="cursor-pointer"
									/>
								</div>
							</div>
						</div>
					</div>
			}
		</>
	);
};

export default InstagramStoryScreen;