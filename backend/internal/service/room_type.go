package service

var _ RoomTypeServiceInterface = (*RoomTypeService)(nil)

type RoomTypeServiceInterface interface {

}

type RoomTypeService struct {

}

func NewRoomTypeService() *RoomTypeService {
	return &RoomTypeService{
		
	}
}